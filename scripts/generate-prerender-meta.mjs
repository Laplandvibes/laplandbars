// scripts/generate-prerender-meta.mjs  (laplandbars)
//
// Emits scripts/prerender-meta.json — a { "<path>": { "<lang>": { title, description, faq } } }
// map consumed by ../_prerender_routes.mjs via its --meta reader. We only populate
// the HOME route ("/"), carrying the localized title/description plus the FAQ
// array so the prerenderer bakes a server-rendered FAQPage JSON-LD into every
// locale's static home HTML (rich-result eligible at first byte, before React
// hydrates). All other routes are omitted, so they fall through to the normal
// jsonKey reader unchanged.
//
// Source of truth: src/locales/<lang>/pages.json → home.{title,description,faq.items[].{q,a}}.
// Idempotent. Run after the locale JSON is in place (and re-run on any FAQ edit).
//
// One deliberate stop (exit 1): a meta description outside the prerender window.
// ../_prerender_routes.mjs extends a description under 70 characters / 100 width
// units with the page's own sentences and clamps one over 160 / 200 (a CJK
// character counts as 2). The browser shows the source text (PageSeo reads the
// same pages.json key), so a description outside the window would publish a
// different text than the browser shows (gate:meta-hydraatio). Every route in
// routes.json × every locale is checked. Fix the text in pages.json, never the
// prerender.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const LOCALES = resolve(ROOT, 'src', 'locales')

// lang code == folder name under src/locales (matches _prerender_routes.mjs `lang`).
const LANGS = ['en', 'fi', 'de', 'ja', 'es', 'pt-BR', 'zh-CN', 'ko', 'fr', 'it', 'nl', 'sv']

const home = {}
for (const lang of LANGS) {
  const fp = resolve(LOCALES, lang, 'pages.json')
  if (!existsSync(fp)) {
    console.warn(`[gen-meta] WARN: missing ${fp} — skipping ${lang}`)
    continue
  }
  const data = JSON.parse(readFileSync(fp, 'utf-8'))
  const h = data.home || {}
  const faqItems = h.faq && Array.isArray(h.faq.items) ? h.faq.items : []
  const faq = faqItems
    .filter((it) => it && typeof it.q === 'string' && typeof it.a === 'string')
    .map((it) => ({ q: it.q, a: it.a }))
  home[lang] = {
    title: h.title || null,
    description: h.description || null,
    faq,
  }
}

const out = { '/': home }
const outFp = resolve(__dirname, 'prerender-meta.json')
writeFileSync(outFp, JSON.stringify(out, null, 2) + '\n', 'utf-8')

const counts = LANGS.map((l) => `${l}:${home[l] ? home[l].faq.length : 0}`).join(' ')
console.log(`[gen-meta] wrote ${outFp}`)
console.log(`[gen-meta] FAQ items per locale → ${counts}`)

// ---------------------------------------------------------------------------
// Prerender window (../_prerender_routes.mjs ensureDescriptionLength +
// clampDescription): inside it the prerender leaves a description untouched.
// ---------------------------------------------------------------------------
const LEVEA = /[\u1100-\u11FF\u2E80-\uA4CF\uA960-\uA97F\uAC00-\uD7FF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6]/
const leveys = (x) => [...String(x)].reduce((n, c) => n + (LEVEA.test(c) ? 2 : 1), 0)
function ikkunanUlkopuolella(d) {
  const s = String(d).replace(/\s+/g, ' ').trim()
  if (s.length > 160 || leveys(s) > 200 || [...s].length > 160) return `yli 160 merkkiä / 200 leveysyksikköä (${s.length} / ${leveys(s)})`
  if (s.length < 70 && leveys(s) < 100) return `alle 70 merkkiä / 100 leveysyksikköä (${s.length} / ${leveys(s)})`
  return null
}

// Same lookup as the prerender's JSON reader (readJsonLocale): "file.key.path"
// reads src/locales/<lang>/<file>.json when that file exists, otherwise the
// whole dotted path inside pages.json; a key without a dot is a pages.json key.
const jsonCache = new Map()
function readLocaleJson(fp) {
  if (!jsonCache.has(fp)) jsonCache.set(fp, existsSync(fp) ? JSON.parse(readFileSync(fp, 'utf-8')) : null)
  return jsonCache.get(fp)
}
function jsonKeyDescription(lang, jsonKey) {
  const parts = jsonKey.split('.')
  const own = parts.length > 1 ? readLocaleJson(resolve(LOCALES, lang, `${parts[0]}.json`)) : null
  let cursor = own || readLocaleJson(resolve(LOCALES, lang, 'pages.json'))
  for (const p of own ? parts.slice(1) : parts) cursor = cursor?.[p]
  return cursor && typeof cursor.description === 'string' ? cursor.description : null
}

const routes = JSON.parse(readFileSync(resolve(__dirname, 'routes.json'), 'utf-8'))
const ulkona = []
let tarkistettu = 0
for (const route of routes) {
  for (const lang of LANGS) {
    const fromMap = out[route.path]?.[lang]?.description
    const d = fromMap || (route.jsonKey ? jsonKeyDescription(lang, route.jsonKey) : null)
    if (!d) continue
    tarkistettu++
    const syy = ikkunanUlkopuolella(d)
    if (syy) ulkona.push(`  ${lang.padEnd(5)} ${route.path} (${route.jsonKey}.description): ${syy}\n        ${d}`)
  }
}
if (ulkona.length) {
  console.error(`\n[gen-meta] ${ulkona.length} kuvausta prerender-ikkunan ulkopuolella: esirenderöinti jatkaisi tai leikkaisi ne, ja palvelimen HTML näyttäisi eri tekstin kuin selain.`)
  console.error(ulkona.join('\n'))
  console.error('[gen-meta] Kirjoita kuvaus lähteeseen 70–160 merkkiin (CJK-merkki = 2, 100–200 leveysyksikköä): src/locales/<kieli>/pages.json.\n')
  process.exit(1)
}
console.log(`[gen-meta] ${tarkistettu} kuvausta prerender-ikkunassa (${routes.length} reittiä × ${LANGS.length} kieltä)`)
