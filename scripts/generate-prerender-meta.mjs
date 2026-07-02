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

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const LOCALES = resolve(ROOT, 'src', 'locales')

// lang code == folder name under src/locales (matches _prerender_routes.mjs `lang`).
const LANGS = ['en', 'fi', 'de', 'ja', 'es', 'pt-BR', 'zh-CN', 'ko', 'fr', 'it', 'nl']

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
