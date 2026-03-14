/* ═══════════════════════════════════════════
   WORTHIT — script.js (full rewrite)
   Fixes: save-on-confirm, dup wishlist,
   money-avoided logic, animation, i18n,
   custom modals, consistent lang
   New: comparator, cooling-off timer, i18n
═══════════════════════════════════════════ */

// ── i18n ─────────────────────────────────
const TRANSLATIONS = {
  en: {
    'nav.analyze': 'Analyze',
    'nav.compare': 'Compare',
    'nav.history': 'History',
    'nav.settings': 'Settings',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.dark': 'Dark',
    'settings.light': 'Light',
    'settings.reset': 'Danger zone',
    'settings.resetBtn': 'Reset all saved data',
    'confirm.title': 'Are you sure?',
    'confirm.body': 'This will permanently delete all saved decisions, wishlist and profile data.',
    'confirm.yes': 'Yes, delete everything',
    'confirm.no': 'Cancel',
    'hero.analyses': 'analyses',
    'hero.avoided': 'money avoided',
    'hero.buyRate': 'buy rate',
    'form.eyebrow': 'Purchase Details',
    'form.name': 'Product name',
    'form.price': 'Price (EUR)',
    'form.category': 'Category',
    'form.mood': 'Current mood',
    'form.reason': 'Why do you want it?',
    'form.days': "Days you've wanted it",
    'form.alternative': 'I already have a reasonable alternative',
    'form.financial': 'Financial Context',
    'form.income': 'Monthly income (EUR)',
    'form.budget': 'Available budget (EUR)',
    'form.savings': 'Savings (EUR)',
    'form.hourly': 'Hourly income (EUR)',
    'form.goalName': 'Financial goal',
    'form.goalTarget': 'Goal target (EUR)',
    'form.goalCurrent': 'Goal progress (EUR)',
    'form.submit': 'Calculate verdict',
    'form.reset': 'Reset',
    'form.ratings': 'Ratings',
    'slider.necessity': 'Necessity',
    'slider.necessityHint': 'How much do you actually need it?',
    'slider.urgency': 'Urgency',
    'slider.urgencyHint': 'How urgent is it right now?',
    'slider.frequency': 'Frequency',
    'slider.frequencyHint': 'How often will you use it?',
    'slider.longterm': 'Long-term value',
    'slider.longtermHint': 'Value over time?',
    'mood.neutral': 'Neutral',
    'mood.calm': 'Calm',
    'mood.stressed': 'Stressed',
    'mood.bored': 'Bored',
    'mood.excited': 'Excited',
    'mood.sad': 'Sad',
    'result.emptyTitle': 'Awaiting analysis',
    'result.emptySub': 'Fill in the form to get your verdict',
    'result.score': 'Score',
    'result.explanation': 'Analysis',
    'result.income': '% of income',
    'result.savings': '% of savings',
    'result.hours': 'Hours of work',
    'result.impulse': 'Impulse risk',
    'result.goal': 'Goal Impact',
    'result.cooling': 'Cooling-off period',
    'result.coolingHint': "Come back after this timer — if you still want it, it's probably worth it.",
    'result.save': 'Save to history',
    'result.wishlist': 'Add to wishlist',
    'result.another': 'New analysis',
    'wishlist.title': 'Wishlist',
    'compare.title': 'Product Comparator',
    'compare.sub': 'Analyze two products side by side and find the better choice.',
    'compare.run': 'Compare products',
    'compare.winner': 'Better choice',
    'history.title': 'Decision History',
    'history.total': 'Total',
    'history.buy': 'Buy',
    'history.wait': 'Wait',
    'history.skip': 'Skip',
    'history.avoided': 'Avoided',
    'verdict.buy': 'Buy',
    'verdict.wait': 'Wait',
    'verdict.skip': 'Do not buy',
    'impulse.low': 'Low',
    'impulse.medium': 'Medium',
    'impulse.high': 'High',
    'empty.history': 'No saved decisions yet.',
    'empty.wishlist': 'Wishlist is empty.',
    'explanation.buy': 'The verdict is favorable.',
    'explanation.wait': 'Not a clear no — but the timing is not ideal yet.',
    'explanation.skip': 'It is better not to buy this right now.',
    'explanation.pro': 'Pros: ',
    'explanation.caution': 'Cautions: ',
    'explanation.noPro': 'No strong signals clearly supporting this purchase.',
    'explanation.noCaution': 'No major warning signals in the current context.',
    'pos.realNeed': 'appears to be a real need',
    'pos.usedOften': 'likely to be used frequently',
    'pos.ltv': 'offers good long-term value',
    'pos.notImpulse': 'you have wanted it long enough that it does not seem impulsive',
    'pos.affordable': 'affordable relative to your monthly income',
    'pos.clearReason': 'you have a clear reason for this purchase',
    'caut.bigIncome': 'takes a large share of monthly income',
    'caut.bigSavings': 'significantly impacts savings',
    'caut.hasAlt': 'you already have a reasonable alternative',
    'caut.impulse': 'context shows high impulse buying risk',
    'caut.goalDelay': 'slows down your financial goal',
    'caut.recentWant': 'you have wanted it for a very short time',
    'caut.overBudget': 'exceeds your available monthly budget',
    'goal.none': 'No goal set.',
    'goal.funded': 'Your "{name}" goal is already fully funded.',
    'goal.all': 'This purchase would consume the entire remaining amount for "{name}".',
    'goal.pct': 'This purchase would consume {pct}% of the remaining amount for "{name}".',
    'compare.tie': 'It\'s a tie!',
    'compare.reason': '{nameA} scores {scoreA} vs {nameB} scores {scoreB}. {nameA} offers {diff} more points of value.',
    'compare.tieReason': 'Both products scored equally. Consider price and personal preference.',
    'form.saveProfile': 'Save financial data for next time',
    'result.categoryInsight': 'Category insight',
    'cat.electronics': 'Electronics & Tech',
    'cat.health': 'Health & Sport',
    'cat.education': 'Education & Books',
    'cat.home': 'Home & Living',
    'cat.transport': 'Transport & Auto',
    'cat.utilities': 'Services & Utilities',
    'cat.food': 'Food & Drinks',
    'cat.groceries': 'Groceries',
    'cat.clothing': 'Clothing & Fashion',
    'cat.entertainment': 'Entertainment & Hobby',
    'cat.travel': 'Travel',
    'cat.other': 'Other',
  },
  ro: {
    'nav.analyze': 'Analiză',
    'nav.compare': 'Comparare',
    'nav.history': 'Istoric',
    'nav.settings': 'Setări',
    'settings.title': 'Setări',
    'settings.language': 'Limbă',
    'settings.theme': 'Temă',
    'settings.dark': 'Întunecat',
    'settings.light': 'Luminos',
    'settings.reset': 'Zonă periculoasă',
    'settings.resetBtn': 'Șterge toate datele salvate',
    'confirm.title': 'Ești sigur?',
    'confirm.body': 'Aceasta va șterge definitiv toate deciziile, lista de dorințe și datele de profil.',
    'confirm.yes': 'Da, șterge tot',
    'confirm.no': 'Anulează',
    'hero.analyses': 'analize',
    'hero.avoided': 'bani evitați',
    'hero.buyRate': 'rată cumpărare',
    'form.eyebrow': 'Detalii Produs',
    'form.name': 'Nume produs',
    'form.price': 'Preț (EUR)',
    'form.category': 'Categorie',
    'form.mood': 'Stare actuală',
    'form.reason': 'De ce îl vrei?',
    'form.days': 'Zile de când îl vrei',
    'form.alternative': 'Am deja o alternativă rezonabilă',
    'form.financial': 'Context Financiar',
    'form.income': 'Venit lunar (EUR)',
    'form.budget': 'Buget disponibil (EUR)',
    'form.savings': 'Economii (EUR)',
    'form.hourly': 'Venit orar (EUR)',
    'form.goalName': 'Obiectiv financiar',
    'form.goalTarget': 'Țintă obiectiv (EUR)',
    'form.goalCurrent': 'Progres obiectiv (EUR)',
    'form.submit': 'Calculează verdictul',
    'form.reset': 'Resetează',
    'form.ratings': 'Evaluări',
    'slider.necessity': 'Necesitate',
    'slider.necessityHint': 'Cât de mult ai cu adevărat nevoie de el?',
    'slider.urgency': 'Urgență',
    'slider.urgencyHint': 'Cât de urgent este acum?',
    'slider.frequency': 'Frecvență',
    'slider.frequencyHint': 'Cât de des îl vei folosi?',
    'slider.longterm': 'Valoare pe termen lung',
    'slider.longtermHint': 'Valoare în timp?',
    'mood.neutral': 'Neutru',
    'mood.calm': 'Calm',
    'mood.stressed': 'Stresat',
    'mood.bored': 'Plictisit',
    'mood.excited': 'Entuziasmat',
    'mood.sad': 'Trist',
    'result.emptyTitle': 'Aștept analiza',
    'result.emptySub': 'Completează formularul pentru a obține verdictul',
    'result.score': 'Scor',
    'result.explanation': 'Analiză',
    'result.income': '% din venit',
    'result.savings': '% din economii',
    'result.hours': 'Ore de muncă',
    'result.impulse': 'Risc impulsiv',
    'result.goal': 'Impact obiectiv',
    'result.cooling': 'Perioadă de reflecție',
    'result.coolingHint': 'Revino după ce timer-ul se termină — dacă tot îl vrei, probabil merită.',
    'result.save': 'Salvează în istoric',
    'result.wishlist': 'Adaugă în lista de dorințe',
    'result.another': 'Analiză nouă',
    'wishlist.title': 'Listă de dorințe',
    'compare.title': 'Comparator Produse',
    'compare.sub': 'Analizează două produse side-by-side și găsește alegerea mai bună.',
    'compare.run': 'Compară produsele',
    'compare.winner': 'Alegerea mai bună',
    'history.title': 'Istoric Decizii',
    'history.total': 'Total',
    'history.buy': 'Cumpără',
    'history.wait': 'Amână',
    'history.skip': 'Nu cumpăra',
    'history.avoided': 'Evitat',
    'verdict.buy': 'Cumpără',
    'verdict.wait': 'Amână',
    'verdict.skip': 'Nu cumpăra',
    'impulse.low': 'Scăzut',
    'impulse.medium': 'Mediu',
    'impulse.high': 'Ridicat',
    'empty.history': 'Nicio decizie salvată încă.',
    'empty.wishlist': 'Lista de dorințe este goală.',
    'explanation.buy': 'Verdictul este favorabil.',
    'explanation.wait': 'Nu este un refuz clar — dar momentul nu este ideal.',
    'explanation.skip': 'Momentan este mai bine să nu cumperi.',
    'explanation.pro': 'Argumente pro: ',
    'explanation.caution': 'Motive de prudență: ',
    'explanation.noPro': 'Nu există semnale puternice care să susțină clar achiziția.',
    'explanation.noCaution': 'Nu apar semnale majore de avertizare în contextul actual.',
    'pos.realNeed': 'pare o nevoie reală',
    'pos.usedOften': 'sunt șanse mari să îl folosești des',
    'pos.ltv': 'oferă valoare bună pe termen lung',
    'pos.notImpulse': 'îl vrei de suficient timp încât să nu pară un impuls de moment',
    'pos.affordable': 'costul este ușor de dus raportat la venitul lunar',
    'pos.clearReason': 'ai un motiv clar pentru această achiziție',
    'caut.bigIncome': 'ia o parte mare din venitul lunar',
    'caut.bigSavings': 'taie serios din economii',
    'caut.hasAlt': 'ai deja o alternativă rezonabilă',
    'caut.impulse': 'contextul arată un risc mare de cumpărare impulsivă',
    'caut.goalDelay': 'îți încetinește obiectivul financiar',
    'caut.recentWant': 'îl vrei de foarte puțin timp',
    'caut.overBudget': 'depășește bugetul lunar disponibil',
    'goal.none': 'Niciun obiectiv setat.',
    'goal.funded': 'Obiectivul tău "{name}" este deja finanțat complet.',
    'goal.all': 'Această achiziție ar consuma întreaga sumă rămasă pentru "{name}".',
    'goal.pct': 'Această achiziție ar consuma {pct}% din suma rămasă pentru "{name}".',
    'compare.tie': 'Egalitate!',
    'compare.reason': '{nameA} obține {scoreA} vs {nameB} obține {scoreB}. {nameA} oferă cu {diff} puncte mai mult.',
    'compare.tieReason': 'Ambele produse au obținut același scor. Ia în considerare prețul și preferința personală.',
    'form.saveProfile': 'Salvează datele financiare pentru data viitoare',
    'result.categoryInsight': 'Perspectivă categorie',
    'cat.electronics': 'Electronică & Tech',
    'cat.health': 'Sănătate & Sport',
    'cat.education': 'Educație & Cărți',
    'cat.home': 'Casă & Locuință',
    'cat.transport': 'Transport & Auto',
    'cat.utilities': 'Servicii & Utilități',
    'cat.food': 'Alimentare & Băuturi',
    'cat.groceries': 'Groceries',
    'cat.clothing': 'Îmbrăcăminte & Modă',
    'cat.entertainment': 'Divertisment & Hobby',
    'cat.travel': 'Călătorii',
    'cat.other': 'Altele',
  }
};

let currentLang = 'en';

function t(key, vars = {}) {
  let str = (TRANSLATIONS[currentLang] || TRANSLATIONS.en)[key] || key;
  for (const [k, v] of Object.entries(vars)) {
    str = str.replaceAll(`{${k}}`, v);
  }
  return str;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  // Update all category <select> options — data-i18n doesn't work on <option> natively
  document.querySelectorAll('#category, select[name="category"]').forEach(sel => {
    const current = sel.value;
    sel.querySelectorAll('option').forEach(opt => {
      const key = 'cat.' + opt.value;
      const translated = t(key);
      if (translated !== key) opt.textContent = translated;
    });
    sel.value = current;
  });
}

// ── Storage ──────────────────────────────
const SK = { decisions: 'worthit_decisions', wishlist: 'worthit_wishlist', profile: 'worthit_profile', settings: 'worthit_settings' };

function readJSON(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function writeJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function getDecisions()  { const d = readJSON(SK.decisions, []); return Array.isArray(d) ? d : []; }
function getWishlist()   { const d = readJSON(SK.wishlist, []);  return Array.isArray(d) ? d : []; }
function getProfile()    { return readJSON(SK.profile, {}); }
function getSettings()   { return readJSON(SK.settings, { lang: 'en', theme: 'dark' }); }

function saveDecision(dec)  { const arr = getDecisions(); arr.unshift(dec); writeJSON(SK.decisions, arr.slice(0, 100)); }
function saveWishlistItem(i){ const arr = getWishlist();  arr.unshift(i);   writeJSON(SK.wishlist,  arr.slice(0, 100)); }
function updateWishlistItem(id, upd) { writeJSON(SK.wishlist, getWishlist().map(i => i.id === id ? {...i,...upd} : i)); }
function deleteWishlistItem(id)      { writeJSON(SK.wishlist, getWishlist().filter(i => i.id !== id)); }

// ── Helpers ───────────────────────────────
function safeNum(v)    { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function clamp(v,a,b)  { return Math.min(Math.max(v,a),b); }
function fmtCurrency(v){ return new Intl.NumberFormat('en-IE', { style:'currency', currency:'EUR', maximumFractionDigits:2 }).format(safeNum(v)); }
function fmtPct(v)     { return `${safeNum(v).toFixed(1)}%`; }
function fmtHours(v)   { return `${safeNum(v).toFixed(1)}h`; }
function fmtDate(v)    { return new Intl.DateTimeFormat('en-GB', { day:'2-digit', month:'short', year:'numeric' }).format(v ? new Date(v) : new Date()); }

function verdictKey(verdict) {
  if (verdict === 'buy')  return 'buy';
  if (verdict === 'wait') return 'wait';
  return 'skip';
}

// ── Engine ────────────────────────────────
const IMPULSE_MOODS = ['stressed','bored','excited'];

function calculateImpulseRisk(d) {
  let pts = 0;
  if (d.daysWanted <= 2)                pts += 2;
  if (d.necessityScore <= 5)            pts += 1;
  if (d.urgencyScore <= 4)              pts += 1;
  if (d.hasAlternative)                 pts += 1;
  if (IMPULSE_MOODS.includes(d.mood))   pts += 2;
  if (pts >= 5) return 'high';
  if (pts >= 3) return 'medium';
  return 'low';
}

function getGoalImpact(d) {
  if (!d.mainGoalName || d.mainGoalTarget <= 0) return t('goal.none');
  const remaining = Math.max(d.mainGoalTarget - d.mainGoalCurrent, 0);
  if (remaining <= 0) return t('goal.funded', { name: d.mainGoalName });
  if (d.price >= remaining) return t('goal.all', { name: d.mainGoalName });
  const pct = clamp((d.price / remaining) * 100, 0, 100).toFixed(1);
  return t('goal.pct', { pct, name: d.mainGoalName });
}

function buildExplanation(result, d) {
  const positives = [];
  const cautions  = [];

  if (d.necessityScore >= 7)                          positives.push(t('pos.realNeed'));
  if (d.frequencyScore >= 7)                          positives.push(t('pos.usedOften'));
  if (d.longTermValueScore >= 7)                      positives.push(t('pos.ltv'));
  if (d.daysWanted >= 7)                              positives.push(t('pos.notImpulse'));
  if (result.costVsIncomePercent <= 10)               positives.push(t('pos.affordable'));
  if (d.reason && d.reason.length >= 18)              positives.push(t('pos.clearReason'));

  if (result.costVsIncomePercent >= 30)               cautions.push(t('caut.bigIncome'));
  if (result.costVsSavingsPercent >= 20)              cautions.push(t('caut.bigSavings'));
  if (d.hasAlternative)                               cautions.push(t('caut.hasAlt'));
  if (result.impulseRisk === 'high')                  cautions.push(t('caut.impulse'));
  if (d.mainGoalName && /consume|remaining|obiectiv|rămasă/i.test(result.goalImpactText)) cautions.push(t('caut.goalDelay'));
  if (d.daysWanted <= 2)                              cautions.push(t('caut.recentWant'));
  if (d.monthlyBudget > 0 && d.price > d.monthlyBudget) cautions.push(t('caut.overBudget'));

  const prePro     = positives.length ? t('explanation.pro') + positives.join(', ') + '.' : t('explanation.noPro');
  const preCaution = cautions.length  ? t('explanation.caution') + cautions.join(', ') + '.' : t('explanation.noCaution');
  const intro      = result.verdictKey === 'buy' ? t('explanation.buy') : result.verdictKey === 'wait' ? t('explanation.wait') : t('explanation.skip');

  return `${intro} ${prePro} ${preCaution}`;
}

// ── Category system ───────────────────────
const CATEGORY_DATA = {
  electronics:   { boost: 0,  key: 'cat.electronics' },
  health:        { boost: 5,  key: 'cat.health' },
  education:     { boost: 4,  key: 'cat.education' },
  home:          { boost: 2,  key: 'cat.home' },
  transport:     { boost: 1,  key: 'cat.transport' },
  utilities:     { boost: 2,  key: 'cat.utilities' },
  food:          { boost: 1,  key: 'cat.food' },
  groceries:     { boost: 3,  key: 'cat.groceries' },
  clothing:      { boost: -3, key: 'cat.clothing' },
  entertainment: { boost: -4, key: 'cat.entertainment' },
  travel:        { boost: -3, key: 'cat.travel' },
  other:         { boost: 0,  key: 'cat.other' },
};

function getCategoryBoost(category) {
  return CATEGORY_DATA[category]?.boost ?? 0;
}

function getCategoryInsight(category, lang) {
  const insights = {
    en: {
      electronics:   'Tech gear can be genuinely useful, but also a classic impulse category — make sure it solves a real problem, not just gadget envy.',
      health:        'Health & fitness investments pay long-term dividends. A body that works well is hard to put a price on.',
      education:     'Knowledge compounds over time — skills and learning are permanent assets that never depreciate.',
      home:          'Home improvements affect daily quality of life. Practical and often a solid long-term investment.',
      transport:     'Transport needs are usually recurring and functional. Consider total cost of ownership, not just purchase price.',
      utilities:     'Utilities and services are typically necessity-driven — low impulse risk category.',
      food:          'Food & drink purchases are recurring by nature. Ask yourself if this is a habit or a genuine craving.',
      groceries:     'Even small grocery decisions add up over time. Worth being mindful of, even for everyday items.',
      clothing:      'Clothing is one of the highest impulse-purchase categories. Ask: do I need this, or do I just want it right now?',
      entertainment: 'Entertainment brings joy but is inherently temporary. Make sure it fits your budget before it fits your mood.',
      travel:        'Experiences are valuable but fleeting — the memories are real, but so is the cost. Time the purchase when finances are stable.',
      other:         '',
    },
    ro: {
      electronics:   'Gadgeturile pot fi extrem de utile, dar sunt și o categorie clasică de cumpărături impulsive — asigură-te că rezolvă o problemă reală.',
      health:        'Investițiile în sănătate și sport au randament pe termen lung. Un corp care funcționează bine nu are preț.',
      education:     'Cunoașterea se acumulează în timp — skill-urile sunt active permanente care nu se depreciază niciodată.',
      home:          'Îmbunătățirile casei afectează calitatea zilnică a vieții. Practic și adesea o investiție solidă pe termen lung.',
      transport:     'Nevoile de transport sunt de obicei funcționale și recurente. Gândește-te la costul total, nu doar la prețul de achiziție.',
      utilities:     'Serviciile și utilitățile sunt de obicei necesare — categorie cu risc impulsiv scăzut.',
      food:          'Cheltuielile cu mâncarea sunt recurente prin natură. Întreabă-te dacă e un obicei sau o nevoie reală.',
      groceries:     'Chiar și deciziile mici de grocery se adună în timp. Merită să fii atent, chiar și pentru produse de zi cu zi.',
      clothing:      'Îmbrăcămintea este una dintre cele mai riscante categorii pentru cumpărături impulsive. Întreabă-te: am nevoie sau vreau acum?',
      entertainment: 'Divertismentul aduce bucurie dar e temporar prin natura lui. Asigură-te că se încadrează în buget înainte să se încadreze în chef.',
      travel:        'Experiențele sunt valoroase dar trecătoare — amintirile sunt reale, dar și costul. Cumpără când finanțele sunt stabile.',
      other:         '',
    },
  };
  return (insights[lang] || insights.en)[category] || '';
}


  const costVsIncomePercent  = d.monthlyIncome > 0 ? (d.price / d.monthlyIncome) * 100 : 100;
  const costVsSavingsPercent = d.savings > 0       ? (d.price / d.savings) * 100        : 100;
  const hoursOfWork          = d.hourlyIncome > 0  ? d.price / d.hourlyIncome           : d.price;
  const impulseRisk          = calculateImpulseRisk(d);

  const necessityPts     = clamp((d.necessityScore / 10) * 24, 0, 24);
  const frequencyPts     = clamp((d.frequencyScore / 10) * 16, 0, 16);
  const ltvPts           = clamp((d.longTermValueScore / 10) * 20, 0, 20);
  const urgencyDist      = Math.abs(d.urgencyScore - 6);
  const urgencyPts       = clamp(12 - urgencyDist * 2, 0, 12);

  const incomePenalty    = clamp(costVsIncomePercent * 0.55, 0, 18);
  const savingsPenalty   = clamp(costVsSavingsPercent * 0.25, 0, 15);
  const budgetPenalty    = d.monthlyBudget > 0 ? clamp(((d.price - d.monthlyBudget) / d.monthlyBudget) * 25, 0, 12) : 8;
  const altPenalty       = d.hasAlternative ? 8 : 0;
  const daysPenalty      = d.daysWanted <= 2 ? 10 : d.daysWanted <= 7 ? 4 : 0;
  const moodPenalty      = IMPULSE_MOODS.includes(d.mood) ? 7 : d.mood === 'sad' ? 4 : 0;

  let goalPenalty = 0;
  if (d.mainGoalName && d.mainGoalTarget > 0) {
    const remaining = Math.max(d.mainGoalTarget - d.mainGoalCurrent, 0);
    if (remaining > 0) goalPenalty = clamp((d.price / remaining) * 18, 0, 18);
  }

  const categoryBoost = getCategoryBoost(d.category);

  const base       = necessityPts + frequencyPts + ltvPts + urgencyPts;
  const penalties  = incomePenalty + savingsPenalty + budgetPenalty + altPenalty + daysPenalty + moodPenalty + goalPenalty;
  const finalScore = Math.round(clamp(base - penalties + 28 + categoryBoost, 0, 100));

  const vk = finalScore >= 75 ? 'buy' : finalScore >= 50 ? 'wait' : 'skip';
  const goalImpactText  = getGoalImpact(d);
  const categoryInsight = getCategoryInsight(d.category, currentLang);

  const result = { finalScore, verdictKey: vk, impulseRisk, costVsIncomePercent, costVsSavingsPercent, hoursOfWork, goalImpactText, categoryInsight, category: d.category };
  result.explanation = buildExplanation(result, d);
  return result;
}

// ── Score ring animation (SVG) ────────────
function animateScoreRing(arcEl, score, color) {
  const circumference = 326.73; // 2π×52
  const targetOffset  = circumference - (score / 100) * circumference;
  arcEl.style.stroke = color;
  arcEl.style.strokeDashoffset = circumference; // reset
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      arcEl.style.strokeDashoffset = targetOffset;
    });
  });
}

const VERDICT_COLORS = { buy: '#22c88a', wait: '#f0a535', skip: '#f05252' };

// ── Cooling-off timer ─────────────────────
let coolingInterval = null;

function startCoolingTimer() {
  const timerEl = document.getElementById('coolingTimer');
  const block   = document.getElementById('coolingBlock');
  block.classList.remove('hidden');

  if (coolingInterval) clearInterval(coolingInterval);
  let remaining = 48 * 3600;

  function update() {
    const h = String(Math.floor(remaining / 3600)).padStart(2, '0');
    const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    timerEl.textContent = `${h}:${m}:${s}`;
    if (remaining <= 0) clearInterval(coolingInterval);
    remaining--;
  }
  update();
  coolingInterval = setInterval(update, 1000);
}

// ── Main form ─────────────────────────────
const purchaseForm   = document.getElementById('purchaseForm');
const resultEmpty    = document.getElementById('resultEmpty');
const resultContent  = document.getElementById('resultContent');
const saveHistoryBtn = document.getElementById('saveHistoryBtn');
const wishlistBtn    = document.getElementById('wishlistBtn');
const analyzeAnotherBtn = document.getElementById('analyzeAnotherBtn');
const resetFormBtn   = document.getElementById('resetFormBtn');

let pendingResult = null; // holds last evaluation, saved only on explicit button click

function getFormData() {
  return {
    productName:       purchaseForm.productName.value.trim(),
    price:             safeNum(purchaseForm.price.value),
    category:          purchaseForm.category.value.trim() || 'Other',
    reason:            purchaseForm.reason.value.trim(),
    necessityScore:    safeNum(purchaseForm.necessityScore.value),
    urgencyScore:      safeNum(purchaseForm.urgencyScore.value),
    frequencyScore:    safeNum(purchaseForm.frequencyScore.value),
    longTermValueScore:safeNum(purchaseForm.longTermValueScore.value),
    hasAlternative:    purchaseForm.hasAlternative.checked,
    daysWanted:        safeNum(purchaseForm.daysWanted.value),
    mood:              purchaseForm.mood.value,
    monthlyIncome:     safeNum(purchaseForm.monthlyIncome.value),
    monthlyBudget:     safeNum(purchaseForm.monthlyBudget.value),
    savings:           safeNum(purchaseForm.savings.value),
    hourlyIncome:      safeNum(purchaseForm.hourlyIncome.value),
    mainGoalName:      purchaseForm.mainGoalName.value.trim(),
    mainGoalTarget:    safeNum(purchaseForm.mainGoalTarget.value),
    mainGoalCurrent:   safeNum(purchaseForm.mainGoalCurrent.value),
  };
}

function populateProfileFields() {
  const p = getProfile();
  // Only auto-fill if user previously opted in to save
  if (!p._saveEnabled) return;
  ['monthlyIncome','monthlyBudget','savings','hourlyIncome','mainGoalName','mainGoalTarget','mainGoalCurrent'].forEach(k => {
    const el = purchaseForm[k];
    if (el && p[k] !== undefined && p[k] !== null && p[k] !== '') el.value = p[k];
  });
  // Restore checkbox state
  const saveCheck = document.getElementById('saveProfileCheck');
  if (saveCheck) saveCheck.checked = true;
  // Fill compare shared financial fields from profile
  const cmpMap = { monthlyIncome: 'cmpMonthlyIncome', monthlyBudget: 'cmpMonthlyBudget', savings: 'cmpSavings', hourlyIncome: 'cmpHourlyIncome' };
  Object.entries(cmpMap).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el && p[key] !== undefined && p[key] !== null && p[key] !== '') el.value = p[key];
  });
}

function resetForm(keepProfile = true) {
  purchaseForm.reset();
  purchaseForm.necessityScore.value    = 5;
  purchaseForm.urgencyScore.value      = 5;
  purchaseForm.frequencyScore.value    = 5;
  purchaseForm.longTermValueScore.value= 5;
  purchaseForm.daysWanted.value        = 3;
  purchaseForm.mood.value              = 'neutral';
  if (keepProfile) populateProfileFields();
  updateAllRangeOutputs();
}

function renderResult(result, data) {
  resultEmpty.classList.add('hidden');
  resultContent.classList.remove('hidden');

  const arcEl = document.getElementById('scoreArc');
  const color  = VERDICT_COLORS[result.verdictKey];

  // Animate score ring
  animateScoreRing(arcEl, result.finalScore, color);

  // Score number counter
  const scoreEl = document.getElementById('finalScoreValue');
  let cur = 0;
  const target = result.finalScore;
  const step  = Math.max(1, Math.round(target / 40));
  const counter = setInterval(() => {
    cur = Math.min(cur + step, target);
    scoreEl.textContent = cur;
    if (cur >= target) clearInterval(counter);
  }, 20);

  // Verdict
  const chip = document.getElementById('verdictChip');
  chip.textContent = t(`verdict.${result.verdictKey}`);
  chip.className   = `verdict-chip ${result.verdictKey}`;

  document.getElementById('verdictSub').textContent = result.explanation.split('.')[0] + '.';
  document.getElementById('explanationText').textContent = result.explanation;

  document.getElementById('incomePercentValue').textContent = fmtPct(result.costVsIncomePercent);
  document.getElementById('savingsPercentValue').textContent= fmtPct(result.costVsSavingsPercent);
  document.getElementById('hoursOfWorkValue').textContent   = fmtHours(result.hoursOfWork);

  const impulseEl = document.getElementById('impulseRiskValue');
  impulseEl.textContent = t(`impulse.${result.impulseRisk}`);
  impulseEl.style.color = VERDICT_COLORS[result.impulseRisk === 'low' ? 'buy' : result.impulseRisk === 'medium' ? 'wait' : 'skip'];

  document.getElementById('goalImpactValue').textContent = result.goalImpactText;

  // Category insight
  const insightBlock = document.getElementById('categoryInsightBlock');
  const insightText  = document.getElementById('categoryInsightValue');
  if (result.categoryInsight) {
    insightText.textContent = result.categoryInsight;
    insightBlock.classList.remove('hidden');
  } else {
    insightBlock.classList.add('hidden');
  }

  // Cooling-off timer only for "wait" verdict
  if (result.verdictKey === 'wait') {
    startCoolingTimer();
  } else {
    document.getElementById('coolingBlock').classList.add('hidden');
    if (coolingInterval) { clearInterval(coolingInterval); coolingInterval = null; }
  }

  // Reset save button state
  saveHistoryBtn.textContent = t('result.save');
  saveHistoryBtn.disabled = false;
  wishlistBtn.textContent    = t('result.wishlist');

  pendingResult = {
    id:          crypto.randomUUID(),
    productName: data.productName,
    price:       data.price,
    category:    data.category,
    finalScore:  result.finalScore,
    verdictKey:  result.verdictKey,
    explanation: result.explanation,
    impulseRisk: result.impulseRisk,
    dateCreated: new Date().toISOString(),
  };
}

document.getElementById('calculateBtn').addEventListener('click', () => {
  // Manual validation — iOS Safari safe
  const name  = purchaseForm.productName.value.trim();
  const price = purchaseForm.price.value;
  if (!name) {
    purchaseForm.productName.focus();
    purchaseForm.productName.style.outline = '2px solid #f05252';
    return;
  }
  purchaseForm.productName.style.outline = '';
  if (!price || isNaN(Number(price))) {
    purchaseForm.price.focus();
    purchaseForm.price.style.outline = '2px solid #f05252';
    return;
  }
  purchaseForm.price.style.outline = '';

  const data = getFormData();
  const result = evaluate(data);

  // Save financial profile only if user opted in
  const saveCheck = document.getElementById('saveProfileCheck');
  if (saveCheck && saveCheck.checked) {
    writeJSON(SK.profile, {
      monthlyIncome: data.monthlyIncome, monthlyBudget: data.monthlyBudget,
      savings: data.savings, hourlyIncome: data.hourlyIncome,
      mainGoalName: data.mainGoalName, mainGoalTarget: data.mainGoalTarget,
      mainGoalCurrent: data.mainGoalCurrent,
      _saveEnabled: true,
    });
  }

  renderResult(result, data);
  document.getElementById('resultPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Save to history — explicit, on button click
saveHistoryBtn.addEventListener('click', () => {
  if (!pendingResult) return;
  saveDecision(pendingResult);
  saveHistoryBtn.textContent = '✓ Saved';
  saveHistoryBtn.disabled = true;
  refreshHistoryTab();
});

// Add to wishlist — check duplicates
wishlistBtn.addEventListener('click', () => {
  if (!pendingResult) return;
  const wl = getWishlist();
  const isDup = wl.some(i => i.productName === pendingResult.productName && i.price === pendingResult.price);
  if (isDup) { wishlistBtn.textContent = '✓ Already in list'; return; }
  saveWishlistItem({ id: crypto.randomUUID(), productName: pendingResult.productName, price: pendingResult.price, category: pendingResult.category, status: 'active', dateCreated: new Date().toISOString() });
  wishlistBtn.textContent = '✓ Added';
  renderWishlist();
  setTimeout(() => { wishlistBtn.textContent = t('result.wishlist'); }, 1600);
});

analyzeAnotherBtn.addEventListener('click', () => {
  resetForm(true);
  resultContent.classList.add('hidden');
  resultEmpty.classList.remove('hidden');
  pendingResult = null;
  document.getElementById('tab-analyzer').scrollIntoView({ behavior: 'smooth', block: 'start' });
  purchaseForm.productName.focus();
});

resetFormBtn.addEventListener('click', () => { resetForm(true); purchaseForm.productName.focus(); });

// ── Range outputs ─────────────────────────
function updateAllRangeOutputs() {
  document.querySelectorAll('[data-range-output]').forEach(span => {
    const targetId = span.dataset.rangeOutput;
    // Try by id first, fallback to sibling input
    const input = document.getElementById(targetId) ||
                  span.closest('.slider-card')?.querySelector('input[type="range"]');
    if (input) span.textContent = input.value;
  });
}

// Attach range listeners — input + change + touchmove for iOS Safari
function attachRangeListeners() {
  document.querySelectorAll('input[type="range"]').forEach(inp => {
    ['input', 'change', 'touchmove'].forEach(evt => {
      inp.addEventListener(evt, () => {
        // Update just this slider's output directly
        const card = inp.closest('.slider-card');
        if (card) {
          const out = card.querySelector('.slider-val');
          if (out) out.textContent = inp.value;
        }
        // Also sync all
        updateAllRangeOutputs();
      }, { passive: true });
    });
  });
}
attachRangeListeners();

// ── Wishlist render ───────────────────────
function renderWishlist() {
  const container = document.getElementById('wishlistList');
  const items     = getWishlist();
  container.innerHTML = '';

  if (!items.length) {
    container.innerHTML = `<div class="empty-state">${t('empty.wishlist')}</div>`;
    return;
  }

  const tpl = document.getElementById('wishlistItemTpl');
  items.forEach(item => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.wishlist-name').textContent = item.productName;
    node.querySelector('.wishlist-meta').textContent = `${fmtCurrency(item.price)} · ${item.category || 'Other'} · ${item.status}`;
    node.querySelectorAll('[data-action]').forEach(btn => { btn.dataset.id = item.id; });
    container.appendChild(node);
  });
}

document.getElementById('wishlistList').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { id, action } = btn.dataset;
  if (action === 'bought')  updateWishlistItem(id, { status: 'bought' });
  if (action === 'dismiss') updateWishlistItem(id, { status: 'dismissed' });
  if (action === 'delete')  deleteWishlistItem(id);
  renderWishlist();
});

// ── History tab ───────────────────────────
function refreshHistoryTab() {
  const decisions = getDecisions();
  const total     = decisions.length;
  const buy       = decisions.filter(d => d.verdictKey === 'buy').length;
  const wait      = decisions.filter(d => d.verdictKey === 'wait').length;
  const skip      = decisions.filter(d => d.verdictKey === 'skip').length;
  // "avoided" = only skip (not wait — wait might still be bought)
  const avoided   = decisions.filter(d => d.verdictKey === 'skip').reduce((s, d) => s + safeNum(d.price), 0);
  const buyRate   = total ? Math.round((buy / total) * 100) + '%' : '—';

  // Overview cards
  document.getElementById('ovTotal').textContent   = total;
  document.getElementById('ovBuy').textContent     = buy;
  document.getElementById('ovWait').textContent    = wait;
  document.getElementById('ovSkip').textContent    = skip;
  document.getElementById('ovAvoided').textContent = fmtCurrency(avoided);

  // Hero bar
  document.getElementById('heroDecisions').textContent = total;
  document.getElementById('heroAvoided').textContent   = fmtCurrency(avoided);
  document.getElementById('heroBuyRate').textContent   = buyRate;

  // Bars
  const buyPct  = total ? (buy  / total) * 100 : 0;
  const waitPct = total ? (wait / total) * 100 : 0;
  const skipPct = total ? (skip / total) * 100 : 0;
  document.getElementById('buyBar').style.width   = buyPct  + '%';
  document.getElementById('waitBar').style.width  = waitPct + '%';
  document.getElementById('skipBar').style.width  = skipPct + '%';
  document.getElementById('buyPct').textContent   = Math.round(buyPct)  + '%';
  document.getElementById('waitPct').textContent  = Math.round(waitPct) + '%';
  document.getElementById('skipPct').textContent  = Math.round(skipPct) + '%';

  // History list
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  if (!decisions.length) {
    list.innerHTML = `<div class="empty-state">${t('empty.history')}</div>`;
    return;
  }
  const tpl = document.getElementById('historyItemTpl');
  decisions.slice(0, 20).forEach(item => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.history-name').textContent     = item.productName;
    node.querySelector('.history-item-meta').textContent= `${fmtCurrency(item.price)} · ${item.category || 'Other'} · ${fmtDate(item.dateCreated)} · score ${item.finalScore}`;
    node.querySelector('.history-item-exp').textContent = item.explanation || '';
    const tag = node.querySelector('.verdict-tag');
    tag.textContent  = t(`verdict.${item.verdictKey || (item.verdict === 'Buy' ? 'buy' : item.verdict === 'Wait' ? 'wait' : 'skip')}`);
    tag.className    = `verdict-tag ${item.verdictKey || (item.verdict === 'Buy' ? 'buy' : item.verdict === 'Wait' ? 'wait' : 'skip')}`;
    list.appendChild(node);
  });
}

// ── Comparator ────────────────────────────
function getCompareFormData(formEl) {
  return {
    productName:        formEl.querySelector('[name="productName"]').value.trim() || '—',
    price:              safeNum(formEl.querySelector('[name="price"]').value),
    category:           formEl.querySelector('[name="category"]').value || 'other',
    daysWanted:         safeNum(formEl.querySelector('[name="daysWanted"]').value),
    necessityScore:     safeNum(formEl.querySelector('[name="necessityScore"]').value),
    urgencyScore:       safeNum(formEl.querySelector('[name="urgencyScore"]').value),
    frequencyScore:     safeNum(formEl.querySelector('[name="frequencyScore"]').value),
    longTermValueScore: safeNum(formEl.querySelector('[name="longTermValueScore"]').value),
    hasAlternative:     false,
    mood:               'neutral',
    reason:             '',
    mainGoalName:       '',
    mainGoalTarget:     0,
    mainGoalCurrent:    0,
  };
}

document.getElementById('compareBtn').addEventListener('click', () => {
  const sharedIncome  = safeNum(document.getElementById('cmpMonthlyIncome').value);
  const sharedBudget  = safeNum(document.getElementById('cmpMonthlyBudget').value);
  const sharedSavings = safeNum(document.getElementById('cmpSavings').value);
  const sharedHourly  = safeNum(document.getElementById('cmpHourlyIncome').value);

  const dA = {
    ...getCompareFormData(document.getElementById('compareFormA')),
    monthlyIncome: sharedIncome,
    monthlyBudget: sharedBudget || sharedIncome,
    savings:       sharedSavings,
    hourlyIncome:  sharedHourly,
  };
  const dB = {
    ...getCompareFormData(document.getElementById('compareFormB')),
    monthlyIncome: sharedIncome,
    monthlyBudget: sharedBudget || sharedIncome,
    savings:       sharedSavings,
    hourlyIncome:  sharedHourly,
  };

  const rA = evaluate(dA);
  const rB = evaluate(dB);

  // Render
  const resultEl = document.getElementById('compareResult');
  resultEl.classList.remove('hidden');
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  function fillCard(prefix, data, result) {
    document.getElementById(`compareName${prefix}`).textContent    = data.productName;
    document.getElementById(`compareScore${prefix}`).textContent   = result.finalScore;
    const arc = document.getElementById(`compareArc${prefix}`);
    animateScoreRing(arc, result.finalScore, VERDICT_COLORS[result.verdictKey]);
    const vc = document.getElementById(`compareVerdict${prefix}`);
    vc.textContent = t(`verdict.${result.verdictKey}`);
    vc.className   = `compare-verdict ${result.verdictKey}`;
    const stats = document.getElementById(`compareStats${prefix}`);
    stats.innerHTML = `
      <span><em>${t('result.income')}</em><strong>${fmtPct(result.costVsIncomePercent)}</strong></span>
      <span><em>${t('result.hours')}</em><strong>${fmtHours(result.hoursOfWork)}</strong></span>
      <span><em>${t('result.impulse')}</em><strong>${t('impulse.' + result.impulseRisk)}</strong></span>
    `;
  }

  fillCard('A', dA, rA);
  fillCard('B', dB, rB);

  // Determine winner
  const cardA = document.getElementById('compareResultA');
  const cardB = document.getElementById('compareResultB');
  cardA.classList.remove('winner');
  cardB.classList.remove('winner');

  const winnerNameEl   = document.getElementById('winnerName');
  const winnerReasonEl = document.getElementById('winnerReason');

  if (rA.finalScore > rB.finalScore) {
    cardA.classList.add('winner');
    winnerNameEl.textContent   = dA.productName;
    winnerReasonEl.textContent = t('compare.reason', { nameA: dA.productName, scoreA: rA.finalScore, nameB: dB.productName, scoreB: rB.finalScore, diff: rA.finalScore - rB.finalScore });
  } else if (rB.finalScore > rA.finalScore) {
    cardB.classList.add('winner');
    winnerNameEl.textContent   = dB.productName;
    winnerReasonEl.textContent = t('compare.reason', { nameA: dB.productName, scoreA: rB.finalScore, nameB: dA.productName, scoreB: rA.finalScore, diff: rB.finalScore - rA.finalScore });
  } else {
    winnerNameEl.textContent   = t('compare.tie');
    winnerReasonEl.textContent = t('compare.tieReason');
  }
});

// ── Tab navigation ────────────────────────
function switchTab(tabName) {
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const btn = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
  if (btn) btn.classList.add('active');
  const panel = document.getElementById(`tab-${tabName}`);
  if (panel) panel.classList.add('active');
  if (tabName === 'history') refreshHistoryTab();
}

document.querySelectorAll('.nav-tab').forEach(btn => {
  const handler = e => {
    e.preventDefault();
    e.stopPropagation();
    switchTab(btn.dataset.tab);
  };
  btn.addEventListener('click', handler);
  btn.addEventListener('touchend', handler, { passive: false });
});

// ── Settings modal ────────────────────────
function openModal(overlayId) { document.getElementById(overlayId).classList.add('open'); }
function closeModal(overlayId){ document.getElementById(overlayId).classList.remove('open'); }

const settingsBtn = document.getElementById('settingsBtn');
const openSettings = e => { e.preventDefault(); openModal('settingsOverlay'); };
settingsBtn.addEventListener('click', openSettings);
settingsBtn.addEventListener('touchend', openSettings, { passive: false });
document.getElementById('settingsClose').addEventListener('click', () => closeModal('settingsOverlay'));
document.getElementById('settingsOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('settingsOverlay')) closeModal('settingsOverlay');
});

// Language toggle
document.querySelectorAll('[data-lang]').forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    document.documentElement.setAttribute('data-lang', currentLang);
    document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === currentLang));
    applyTranslations();
    refreshHistoryTab();
    renderWishlist();
    const s = getSettings(); s.lang = currentLang; writeJSON(SK.settings, s);
  });
});

// Theme toggle
document.querySelectorAll('[data-theme]').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme]').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
    const s = getSettings(); s.theme = theme; writeJSON(SK.settings, s);
  });
});

// Reset data — custom modal
document.getElementById('resetDataBtn').addEventListener('click', () => {
  closeModal('settingsOverlay');
  openModal('confirmOverlay');
});
document.getElementById('confirmNo').addEventListener('click',  () => closeModal('confirmOverlay'));
document.getElementById('confirmOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('confirmOverlay')) closeModal('confirmOverlay');
});
document.getElementById('confirmYes').addEventListener('click', () => {
  localStorage.removeItem(SK.decisions);
  localStorage.removeItem(SK.wishlist);
  localStorage.removeItem(SK.profile);
  pendingResult = null;
  resetForm(false);
  resultContent.classList.add('hidden');
  resultEmpty.classList.remove('hidden');
  closeModal('confirmOverlay');
  refreshHistoryTab();
  renderWishlist();
});

// ── Init ──────────────────────────────────
function init() {
  const settings = getSettings();
  currentLang = settings.lang || 'en';
  const theme = settings.theme || 'dark';

  document.documentElement.setAttribute('data-lang', currentLang);
  document.documentElement.setAttribute('data-theme', theme);

  // Sync toggle buttons to stored settings
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === currentLang));
  document.querySelectorAll('[data-theme]').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));

  applyTranslations();
  populateProfileFields();
  resetForm(true);
  refreshHistoryTab();
  renderWishlist();
}

init();
