#!/usr/bin/env node
/**
 * Kertaluonteinen migraatio 11.9.2026: `bars.ts`:n Localised-kentät (hours,
 * price, temp, season) kaikille 12 kielelle.
 *
 * MIKSI: kentillä oli vain en/fi/de (39 riviä kutakin, 0 muita). `pickLocalised`
 * putoaa englantiin, joten ruotsin, ranskan, italian, hollannin, espanjan,
 * portugalin, japanin, korean ja kiinan lukija näki aukioloajat ja hinnat
 * englanniksi ("Mon–Fri 09–21, Sun closed") 24 baarikortissa.
 *
 * Kaksi reittiä:
 *  1. SPECIAL — käsin kirjoitettu 12 kielelle, kun merkkijono on lause.
 *  2. Kaavio — "Mon–Fri 09–21, Sat 12–21, Sun closed" -muoto käännetään
 *     taulukolla (päivälyhenteet, Daily/closed/kitchen). Numerot eivät muutu,
 *     joten numeroportti (OHJE-NATIIVIKAANNOS §numeroportti) pitää.
 *
 * Jos EN-merkkijono ei osu kumpaankaan, skripti kaatuu ja listaa sen —
 * mitään ei keksitä eikä jätetä englanniksi hiljaa.
 *
 * Aja: node scripts/_gen-localised-hours.mjs          (kuivaharjoitus, näyttää diffin)
 *      node scripts/_gen-localised-hours.mjs --write  (kirjoittaa bars.ts)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = resolve(ROOT, 'src/data/bars.ts');
const WRITE = process.argv.includes('--write');

const LANGS = ['fi', 'de', 'sv', 'fr', 'it', 'nl', 'es', 'pt-BR', 'ja', 'ko', 'zh-CN'];
const KEY = { 'pt-BR': "'pt-BR'", 'zh-CN': "'zh-CN'" };

const DAYS = {
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  fi: ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'],
  de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  sv: ['Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör', 'Sön'],
  fr: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  it: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
  nl: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'],
  es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  'pt-BR': ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  ja: ['月', '火', '水', '木', '金', '土', '日'],
  ko: ['월', '화', '수', '목', '금', '토', '일'],
  'zh-CN': ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
};
const WORDS = {
  fi: { daily: 'Päivittäin', closed: 'suljettu', kitchen: 'keittiö', sep: ', ' },
  de: { daily: 'Täglich', closed: 'geschlossen', kitchen: 'Küche', sep: ', ' },
  sv: { daily: 'Dagligen', closed: 'stängt', kitchen: 'kök', sep: ', ' },
  fr: { daily: 'Tous les jours', closed: 'fermé', kitchen: 'cuisine', sep: ', ' },
  it: { daily: 'Tutti i giorni', closed: 'chiuso', kitchen: 'cucina', sep: ', ' },
  nl: { daily: 'Dagelijks', closed: 'gesloten', kitchen: 'keuken', sep: ', ' },
  es: { daily: 'Todos los días', closed: 'cerrado', kitchen: 'cocina', sep: ', ' },
  'pt-BR': { daily: 'Todos os dias', closed: 'fechado', kitchen: 'cozinha', sep: ', ' },
  ja: { daily: '毎日', closed: '定休', kitchen: 'キッチン', sep: '、' },
  ko: { daily: '매일', closed: '휴무', kitchen: '주방', sep: ', ' },
  'zh-CN': { daily: '每天', closed: '休息', kitchen: '厨房', sep: '，' },
};

/** Lauseet, joita kaavio ei kata: kirjoitettu kunkin kielen omasta rakenteesta. */
const SPECIAL = {
  'Check venue for current hours': {
    fi: 'Tarkista aukioloajat suoraan paikasta', de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
    sv: 'Kontrollera aktuella öppettider hos stället', fr: 'Horaires à vérifier auprès de l’établissement',
    it: 'Verifica gli orari aggiornati sul sito del locale', nl: 'Actuele openingstijden bij de zaak checken',
    es: 'Consulte el horario actual en el local', 'pt-BR': 'Confira o horário atual com o local',
    ja: '最新の営業時間は店舗にご確認ください', ko: '최신 영업시간은 매장에 확인하세요', 'zh-CN': '营业时间请以店家为准',
  },
  'Tue–Fri 09–18, Sat–Mon closed (longer hours in the Christmas season)': {
    fi: 'Ti–Pe 09–18, La–Ma suljettu (joulun aikaan pidemmät ajat)', de: 'Di–Fr 09–18, Sa–Mo geschlossen (in der Weihnachtszeit länger)',
    sv: 'Tis–Fre 09–18, Lör–Mån stängt (längre öppettider i juletid)', fr: 'Mar–Ven 09–18, Sam–Lun fermé (horaires étendus pendant les fêtes)',
    it: 'Mar–Ven 09–18, Sab–Lun chiuso (orari più lunghi nel periodo natalizio)', nl: 'Di–Vr 09–18, Za–Ma gesloten (ruimere tijden in de kersttijd)',
    es: 'Mar–Vie 09–18, Sáb–Lun cerrado (horario ampliado en Navidad)', 'pt-BR': 'Ter–Sex 09–18, Sáb–Seg fechado (horário estendido no Natal)',
    ja: '火–金 09–18、土–月 定休（クリスマス期は延長営業）', ko: '화–금 09–18, 토–월 휴무 (크리스마스 시즌에는 연장 영업)', 'zh-CN': '周二–周五 09–18，周六–周一 休息（圣诞季延长营业）',
  },
  'Daily 11–22 (Dec 15 – Mar 31)': {
    fi: 'Päivittäin 11–22 (15.12.–31.3.)', de: 'Täglich 11–22 (15. Dez. – 31. März)', sv: 'Dagligen 11–22 (15 dec–31 mars)',
    fr: 'Tous les jours 11–22 (15 déc. – 31 mars)', it: 'Tutti i giorni 11–22 (15 dic – 31 mar)', nl: 'Dagelijks 11–22 (15 dec – 31 mrt)',
    es: 'Todos los días 11–22 (15 dic – 31 mar)', 'pt-BR': 'Todos os dias 11–22 (15 dez – 31 mar)',
    ja: '毎日 11–22（12月15日〜3月31日）', ko: '매일 11–22 (12월 15일–3월 31일)', 'zh-CN': '每天 11–22（12 月 15 日–3 月 31 日）',
  },
  'Performance nights, doors 20–21, closes 03:30': {
    fi: 'Esiintymisiltoina, ovet 20–21, sulkee 03:30', de: 'An Veranstaltungsabenden, Einlass 20–21, Schluss 03:30',
    sv: 'Spelningskvällar, dörrarna 20–21, stänger 03:30', fr: 'Soirs de concert, portes 20–21, fermeture 03:30',
    it: 'Serate con spettacolo, porte 20–21, chiude alle 03:30', nl: 'Op optreedavonden, deuren 20–21, sluit 03:30',
    es: 'Noches con actuación, puertas 20–21, cierra 03:30', 'pt-BR': 'Noites de show, portas 20–21, fecha 03:30',
    ja: '公演の夜のみ、開場 20–21、閉店 03:30', ko: '공연 밤에만, 입장 20–21, 마감 03:30', 'zh-CN': '演出之夜营业，开门 20–21，03:30 打烊',
  },
  'Nightly until 04:00, weekly schedule on the venue site': {
    fi: 'Iltaisin 04:00 asti, viikko-ohjelma paikan sivulla', de: 'Abends bis 04:00, Wochenplan auf der Website des Lokals',
    sv: 'Kvällar till 04:00, veckoschema på ställets sida', fr: 'Tous les soirs jusqu’à 04:00, programme hebdomadaire sur le site du bar',
    it: 'Ogni sera fino alle 04:00, programma settimanale sul sito del locale', nl: 'Elke avond tot 04:00, weekrooster op de site van de zaak',
    es: 'Cada noche hasta las 04:00, programa semanal en la web del local', 'pt-BR': 'Toda noite até 04:00, programação semanal no site da casa',
    ja: '毎晩 04:00まで、週間スケジュールは店舗サイトで', ko: '매일 밤 04:00까지, 주간 일정은 매장 사이트에', 'zh-CN': '每晚营业至 04:00，每周安排见店家网站',
  },
  'Sun–Thu 14–00, Fri–Sat 14–02 (ski season daily 12–02)': {
    fi: 'Su–To 14–00, Pe–La 14–02 (hiihtokaudella päivittäin 12–02)', de: 'So–Do 14–00, Fr–Sa 14–02 (in der Skisaison täglich 12–02)',
    sv: 'Sön–Tors 14–00, Fre–Lör 14–02 (under skidsäsongen dagligen 12–02)', fr: 'Dim–Jeu 14–00, Ven–Sam 14–02 (saison de ski : tous les jours 12–02)',
    it: 'Dom–Gio 14–00, Ven–Sab 14–02 (in stagione sciistica tutti i giorni 12–02)', nl: 'Zo–Do 14–00, Vr–Za 14–02 (in het skiseizoen dagelijks 12–02)',
    es: 'Dom–Jue 14–00, Vie–Sáb 14–02 (en temporada de esquí, a diario 12–02)', 'pt-BR': 'Dom–Qui 14–00, Sex–Sáb 14–02 (na temporada de esqui, todos os dias 12–02)',
    ja: '日–木 14–00、金–土 14–02（スキーシーズンは毎日 12–02）', ko: '일–목 14–00, 금–토 14–02 (스키 시즌에는 매일 12–02)', 'zh-CN': '周日–周四 14–00，周五–周六 14–02（滑雪季每天 12–02）',
  },
  'Ski season only, Fri–Sat nights; closed off-season': {
    fi: 'Vain hiihtokaudella pe–la-iltaisin; kauden ulkopuolella suljettu', de: 'Nur in der Skisaison, Fr–Sa abends; außerhalb der Saison geschlossen',
    sv: 'Bara under skidsäsongen, fre–lör kvällar; stängt utanför säsong', fr: 'Saison de ski uniquement, soirs de ven–sam ; fermé hors saison',
    it: 'Solo in stagione sciistica, ven–sab sera; chiuso fuori stagione', nl: 'Alleen in het skiseizoen, vr–za-avonden; buiten het seizoen gesloten',
    es: 'Solo en temporada de esquí, noches de vie–sáb; cerrado fuera de temporada', 'pt-BR': 'Só na temporada de esqui, noites de sex–sáb; fechado fora da temporada',
    ja: 'スキーシーズンのみ、金・土の夜；シーズン外は休業', ko: '스키 시즌에만 금–토 밤 영업; 비수기 휴무', 'zh-CN': '仅滑雪季周五–周六夜间营业；淡季休息',
  },
  'Daily 11–16 (summer); après-ski hours in winter. Check venue': {
    fi: 'Päivittäin 11–16 (kesä); talvella après-ski-ajat. Tarkista paikasta', de: 'Täglich 11–16 (Sommer); im Winter Après-Ski-Zeiten. Beim Lokal prüfen',
    sv: 'Dagligen 11–16 (sommar); afterski-tider på vintern. Kolla med stället', fr: 'Tous les jours 11–16 (été) ; horaires après-ski en hiver. Vérifier auprès du lieu',
    it: 'Tutti i giorni 11–16 (estate); in inverno orari après-ski. Verificare col locale', nl: 'Dagelijks 11–16 (zomer); in de winter après-skitijden. Check bij de zaak',
    es: 'Todos los días 11–16 (verano); en invierno horario après-ski. Consulte el local', 'pt-BR': 'Todos os dias 11–16 (verão); no inverno horário de après-ski. Confira com o local',
    ja: '毎日 11–16（夏）；冬はアプレスキー営業。店舗に確認', ko: '매일 11–16 (여름); 겨울에는 아프레 스키 시간. 매장에 확인', 'zh-CN': '每天 11–16（夏季）；冬季为滑雪后派对时段。请向店家确认',
  },
  // ── hinnat ──
  'Pint ~€7': { fi: 'Tuoppi noin 7 €', de: 'Pint ~7 €', sv: 'Stor stark ca 7 €', fr: 'Pinte ~7 €', it: 'Pinta ~7 €', nl: 'Pint ~€7', es: 'Pinta ~7 €', 'pt-BR': 'Pint ~7 €', ja: 'パイント約7€', ko: '파인트 약 7€', 'zh-CN': '一品脱约 7 €' },
  'Pint ~€6–8': { fi: 'Tuoppi noin 6–8 €', de: 'Pint ~6–8 €', sv: 'Stor stark ca 6–8 €', fr: 'Pinte ~6–8 €', it: 'Pinta ~6–8 €', nl: 'Pint ~€6–8', es: 'Pinta ~6–8 €', 'pt-BR': 'Pint ~6–8 €', ja: 'パイント約6–8€', ko: '파인트 약 6–8€', 'zh-CN': '一品脱约 6–8 €' },
  'Beer ~€6–7': { fi: 'Olut noin 6–7 €', de: 'Bier ~6–7 €', sv: 'Öl ca 6–7 €', fr: 'Bière ~6–7 €', it: 'Birra ~6–7 €', nl: 'Bier ~€6–7', es: 'Cerveza ~6–7 €', 'pt-BR': 'Cerveja ~6–7 €', ja: 'ビール約6–7€', ko: '맥주 약 6–7€', 'zh-CN': '啤酒约 6–7 €' },
  'Beer ~€7–8, mains €16–25': { fi: 'Olut noin 7–8 €, pääruoat 16–25 €', de: 'Bier ~7–8 €, Hauptgerichte 16–25 €', sv: 'Öl ca 7–8 €, huvudrätter 16–25 €', fr: 'Bière ~7–8 €, plats 16–25 €', it: 'Birra ~7–8 €, piatti principali 16–25 €', nl: 'Bier ~€7–8, hoofdgerechten €16–25', es: 'Cerveza ~7–8 €, platos principales 16–25 €', 'pt-BR': 'Cerveja ~7–8 €, pratos principais 16–25 €', ja: 'ビール約7–8€、メイン 16–25€', ko: '맥주 약 7–8€, 메인 요리 16–25€', 'zh-CN': '啤酒约 7–8 €，主菜 16–25 €' },
  'Beer from €8.90': { fi: 'Olut alk. 8,90 €', de: 'Bier ab 8,90 €', sv: 'Öl från 8,90 €', fr: 'Bière à partir de 8,90 €', it: 'Birra da 8,90 €', nl: 'Bier vanaf €8,90', es: 'Cerveza desde 8,90 €', 'pt-BR': 'Cerveja a partir de 8,90 €', ja: 'ビール 8.90€から', ko: '맥주 8.90€부터', 'zh-CN': '啤酒 8.90 € 起' },
  'Cocktail ~€12–15': { fi: 'Drinkki noin 12–15 €', de: 'Cocktail ~12–15 €', sv: 'Cocktail ca 12–15 €', fr: 'Cocktail ~12–15 €', it: 'Cocktail ~12–15 €', nl: 'Cocktail ~€12–15', es: 'Cóctel ~12–15 €', 'pt-BR': 'Coquetel ~12–15 €', ja: 'カクテル約12–15€', ko: '칵테일 약 12–15€', 'zh-CN': '鸡尾酒约 12–15 €' },
  'Cocktail ~€12': { fi: 'Drinkki noin 12 €', de: 'Cocktail ~12 €', sv: 'Cocktail ca 12 €', fr: 'Cocktail ~12 €', it: 'Cocktail ~12 €', nl: 'Cocktail ~€12', es: 'Cóctel ~12 €', 'pt-BR': 'Coquetel ~12 €', ja: 'カクテル約12€', ko: '칵테일 약 12€', 'zh-CN': '鸡尾酒约 12 €' },
  'Mains €14–22': { fi: 'Pääruoat 14–22 €', de: 'Hauptgerichte 14–22 €', sv: 'Huvudrätter 14–22 €', fr: 'Plats 14–22 €', it: 'Piatti principali 14–22 €', nl: 'Hoofdgerechten €14–22', es: 'Platos principales 14–22 €', 'pt-BR': 'Pratos principais 14–22 €', ja: 'メイン 14–22€', ko: '메인 요리 14–22€', 'zh-CN': '主菜 14–22 €' },
  'Lunch / mains €15–25': { fi: 'Lounas / pääruoat 15–25 €', de: 'Mittag / Hauptgerichte 15–25 €', sv: 'Lunch / huvudrätter 15–25 €', fr: 'Déjeuner / plats 15–25 €', it: 'Pranzo / piatti principali 15–25 €', nl: 'Lunch / hoofdgerechten €15–25', es: 'Almuerzo / platos principales 15–25 €', 'pt-BR': 'Almoço / pratos principais 15–25 €', ja: 'ランチ／メイン 15–25€', ko: '점심 / 메인 요리 15–25€', 'zh-CN': '午餐/主菜 15–25 €' },
  'Concert tickets ~€25–30, some nights free': { fi: 'Konserttiliput noin 25–30 €, osa illoista ilmaisia', de: 'Konzerttickets ~25–30 €, manche Abende frei', sv: 'Konsertbiljetter ca 25–30 €, vissa kvällar gratis', fr: 'Billets de concert ~25–30 €, certains soirs gratuits', it: 'Biglietti concerto ~25–30 €, alcune serate gratis', nl: 'Concertkaartjes ~€25–30, sommige avonden gratis', es: 'Entradas de concierto ~25–30 €, algunas noches gratis', 'pt-BR': 'Ingressos de show ~25–30 €, algumas noites grátis', ja: 'コンサートチケット約25–30€、無料の夜もあり', ko: '콘서트 티켓 약 25–30€, 무료인 밤도 있음', 'zh-CN': '演出门票约 25–30 €，部分夜晚免费' },
  'Snowhotel entrance ticket required (overnight guests free)': { fi: 'Vaatii Snowhotel-sisäänpääsylipun (hotelliyöpyjille vapaa)', de: 'Snowhotel-Eintrittskarte erforderlich (Übernachtungsgäste frei)', sv: 'Kräver entrébiljett till Snowhotel (gratis för övernattande gäster)', fr: 'Billet d’entrée Snowhotel requis (gratuit pour les clients hébergés)', it: 'Serve il biglietto d’ingresso allo Snowhotel (gratis per chi pernotta)', nl: 'Snowhotel-toegangskaart vereist (gratis voor overnachtende gasten)', es: 'Requiere entrada al Snowhotel (gratis para huéspedes alojados)', 'pt-BR': 'Exige ingresso do Snowhotel (grátis para hóspedes)', ja: 'Snowhotelの入場券が必要（宿泊客は無料）', ko: 'Snowhotel 입장권 필요 (투숙객 무료)', 'zh-CN': '需购买 Snowhotel 门票（住店客人免费）' },
};

// Lisää tähän jääbaarien season/temp/price-lauseet, kun skripti listaa ne.
const EXTRA_SPECIAL_FILE = resolve(ROOT, 'scripts/_gen-localised-hours.extra.json');
try {
  const extra = JSON.parse(readFileSync(EXTRA_SPECIAL_FILE, 'utf8'));
  Object.assign(SPECIAL, extra);
} catch { /* ei lisätiedostoa */ }

/** "Mon–Fri" / "Sat" → käännetty; palauttaa null jos ei ole päivä. */
function tDays(tok, lang) {
  const m = tok.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:–(Mon|Tue|Wed|Thu|Fri|Sat|Sun))?$/);
  if (!m) return null;
  const d = (x) => DAYS[lang][DAYS.en.indexOf(x)];
  return m[2] ? `${d(m[1])}–${d(m[2])}` : d(m[1]);
}
const TIME = /^\d{1,2}(?::\d{2})?–\d{1,2}(?::\d{2})?(?: \(\d{2}\))?$/;

/** Kaavion mukainen käännös tai null. */
function pattern(en, lang) {
  const w = WORDS[lang];
  const clauses = en.split(', ');
  const out = [];
  for (const c of clauses) {
    let m;
    if ((m = c.match(/^Daily (.+)$/)) && TIME.test(m[1])) { out.push(`${w.daily} ${m[1]}`); continue; }
    if ((m = c.match(/^kitchen (.+)$/)) && TIME.test(m[1])) { out.push(`${w.kitchen} ${m[1]}`); continue; }
    if ((m = c.match(/^(\S+) closed$/)) && tDays(m[1], lang)) { out.push(`${tDays(m[1], lang)} ${w.closed}`); continue; }
    if ((m = c.match(/^(\S+) (.+)$/)) && tDays(m[1], lang) && TIME.test(m[2])) { out.push(`${tDays(m[1], lang)} ${m[2]}`); continue; }
    return null;
  }
  return out.join(w.sep);
}

function translate(en, lang) {
  if (SPECIAL[en]?.[lang]) return SPECIAL[en][lang];
  return pattern(en, lang);
}

// ── bars.ts läpi ──────────────────────────────────────────────────────────
let src = readFileSync(FILE, 'utf8');
const BLOCK = /( +)(hours|price|temp|season): \{\s*([\s\S]*?)\n? *\},?/g;
const missing = new Set();
const changes = [];
src = src.replace(/( +)(hours|price|temp|season): \{([^}]*)\}/g, (whole, indent, field, body) => {
  const en = body.match(/en: '((?:[^'\\]|\\.)*)'/);
  if (!en) return whole;
  const enVal = en[1].replace(/\\'/g, "'");
  const existing = {};
  for (const m of body.matchAll(/(?:'([a-zA-Z-]+)'|([a-zA-Z]+)): '((?:[^'\\]|\\.)*)'/g)) existing[m[1] || m[2]] = m[3].replace(/\\'/g, "'");
  const lines = [`en: '${enVal.replace(/'/g, "\\'")}'`];
  for (const lang of LANGS) {
    const v = translate(enVal, lang);
    if (!v) { missing.add(`${field} :: ${enVal}`); return whole; }
    if (existing[lang] && existing[lang] !== v) changes.push(`${field} [${lang}]  "${existing[lang]}"  →  "${v}"`);
    lines.push(`${KEY[lang] ?? lang}: '${v.replace(/'/g, "\\'")}'`);
  }
  const inner = indent + '  ';
  return `${indent}${field}: {\n${lines.map((l) => inner + l + ',').join('\n')}\n${indent}}`;
});
void BLOCK;

if (missing.size) {
  console.error('EI KÄÄNNÖSTÄ (lisää SPECIAL- tai extra-tiedostoon):');
  for (const m of missing) console.error('  · ' + m);
  process.exit(1);
}
if (changes.length) {
  console.log('Muuttuneet olemassa olevat fi/de-arvot (tarkista):');
  for (const c of changes) console.log('  ' + c);
}
if (WRITE) {
  writeFileSync(FILE, src, 'utf8');
  console.log('kirjoitettu', FILE);
} else {
  console.log('kuivaharjoitus OK — aja --write kirjoittaaksesi');
}
