const STORAGE_KEYS = {
  decisions: 'worthit_decisions',
  wishlist: 'worthit_wishlist',
  profile: 'worthit_profile',
};

const DEFAULT_SETTINGS = {
  language: 'ro',
  currency: 'RON',
};

const CURRENCY_RATES = {
  RON: 1,
  EUR: 5.0947,
  USD: 4.4429,
  GBP: 5.9009,
};

const IMPULSE_MOODS = ['stressed', 'bored', 'excited'];
const PROFILE_FIELDS = [
  'monthlyIncome',
  'monthlyBudget',
  'savings',
  'hourlyIncome',
  'mainGoalName',
  'mainGoalTarget',
  'mainGoalCurrent',
];
const PROFILE_MONEY_FIELDS = [
  'monthlyIncome',
  'monthlyBudget',
  'savings',
  'hourlyIncome',
  'mainGoalTarget',
  'mainGoalCurrent',
];
const CONVERTIBLE_FORM_FIELDS = ['price', ...PROFILE_MONEY_FIELDS];
const VERDICT_LABEL_KEYS = {
  buy: 'buyVerdict',
  wait: 'waitVerdict',
  skip: 'skipVerdict',
};
const RISK_LABEL_KEYS = {
  low: 'risk.low',
  medium: 'risk.medium',
  high: 'risk.high',
};
const STATUS_LABEL_KEYS = {
  active: 'status.active',
  bought: 'status.bought',
  dismissed: 'status.dismissed',
};

const LOCALES = {
  ro: {
    metaTitle: 'WorthIt — Decision Helper pentru cumpărături',
    metaDescription:
      'WorthIt te ajută să decizi dacă merită sau nu să cumperi un produs, pe baza contextului financiar și comportamental.',
    heroEyebrow: 'Decision Helper pentru cumpărături',
    heroSubtitle:
      'Analizează fiecare achiziție prin filtrul nevoii reale, al impactului financiar și al riscului de impuls.',
    languageLabel: 'Limbă',
    currencyLabel: 'Monedă',
    settingsNote: 'Toate sumele din formular, dashboard și istoric folosesc moneda selectată.',
    analyzePurchaseBtn: 'Analizează o cumpărătură',
    seeDashboardBtn: 'Vezi dashboard',
    heroPanelTitle: 'Decizie mai lucidă, mai puțin impuls',
    analysesSaved: 'analize salvate',
    avoidedEstimated: 'bani evitați estimat',
    heroNote: 'Un MVP local, fără backend, cu logică deterministică și date păstrate în browser.',
    dashboardEyebrow: 'Dashboard',
    dashboardTitle: 'Privire rapidă',
    totalAnalyses: 'Total analize',
    acceptedPurchases: 'Cumpărături acceptate',
    postponedPurchases: 'Cumpărături amânate',
    rejectedPurchases: 'Cumpărături respinse',
    moneyAvoided: 'Bani evitați',
    recentDecisions: 'Ultimele decizii',
    recentAnalyses: 'Cele mai recente analize',
    wishlistTitle: 'Wishlist',
    wishlistCaption: 'Produse salvate pentru mai târziu',
    insightsEyebrow: 'Insights',
    insightsTitle: 'Ce spun deciziile tale',
    totalDecisions: 'Total decizii',
    accepted: 'Acceptate',
    postponed: 'Amânate',
    rejected: 'Respinse',
    topRejectedCategoryLabel: 'Categoria cu cele mai multe respingeri',
    verdictDistribution: 'Distribuția verdictelor',
    buyVerdict: 'Cumpără',
    waitVerdict: 'Mai așteaptă',
    skipVerdict: 'Nu cumpăra acum',
    analysisEyebrow: 'Analiză',
    analysisTitle: 'Analizează o cumpărătură',
    productNameLabel: 'Nume produs',
    productNamePlaceholder: 'ex: Căști noise cancelling',
    priceLabel: 'Preț',
    categoryLabel: 'Categorie',
    selectOption: 'Selectează',
    'category.electronics': 'Electronice',
    'category.home': 'Casă',
    'category.clothing': 'Îmbrăcăminte',
    'category.education': 'Educație',
    'category.health': 'Sănătate',
    'category.hobby': 'Hobby',
    'category.travel': 'Călătorii',
    'category.gifts': 'Cadouri',
    'category.other': 'Altceva',
    reasonLabel: 'De ce vrei să îl cumperi?',
    reasonPlaceholder: 'Scrie motivul principal',
    behavioralScoresTitle: 'Scoruri comportamentale',
    scoresLegend: '1 = foarte mic, 10 = foarte mare',
    necessityLabel: 'Necesitate',
    necessityHint: 'Cât de necesar este?',
    urgencyLabel: 'Urgență',
    urgencyHint: 'Cât de urgent este acum?',
    frequencyLabel: 'Frecvență',
    frequencyHint: 'Cât de des îl vei folosi?',
    longTermValueLabel: 'Valoare pe termen lung',
    longTermValueHint: 'Câtă valoare aduce în timp?',
    hasAlternativeLabel: 'Am deja o alternativă rezonabilă',
    daysWantedLabel: 'De câte zile îl vrei?',
    moodLabel: 'Stare curentă',
    'mood.neutral': 'neutral',
    'mood.calm': 'calm',
    'mood.stressed': 'stressed',
    'mood.bored': 'bored',
    'mood.excited': 'excited',
    'mood.sad': 'sad',
    financialContextTitle: 'Context financiar',
    financialContextHint: 'Datele se păstrează local în browser',
    monthlyIncomeLabel: 'Venit lunar',
    monthlyBudgetLabel: 'Buget lunar disponibil',
    savingsLabel: 'Economii',
    hourlyIncomeLabel: 'Venit pe oră',
    mainGoalNameLabel: 'Obiectiv financiar principal',
    mainGoalNamePlaceholder: 'ex: Fond de urgență',
    mainGoalTargetLabel: 'Ținta obiectivului',
    mainGoalCurrentLabel: 'Progres curent (opțional)',
    calculateVerdictBtn: 'Calculează verdictul',
    resetFormBtn: 'Resetează formularul',
    resultEmptyTitle: 'Rezultatul analizei apare aici',
    resultEmptyText:
      'Completează formularul și vei primi un scor final, un verdict clar și un rezumat al impactului financiar.',
    finalScoreLabel: 'Scor final',
    verdictLabel: 'Verdict',
    explanationLabel: 'Explicație',
    financialImpactLabel: 'Impact financiar',
    incomePercentLabel: '% din venitul lunar',
    savingsPercentLabel: '% din economii',
    hoursOfWorkLabel: 'Ore de muncă necesare',
    goalImpactLabel: 'Impact asupra obiectivului',
    impulseRiskLabel: 'Risc de impuls',
    addToWishlistBtn: 'Pune în wishlist',
    analyzeAnotherBtn: 'Analizează alt produs',
    emptyHistory: 'Nu există încă decizii salvate.',
    emptyWishlist: 'Wishlist-ul este gol momentan.',
    scoreMiniLabel: 'Scor:',
    impulseMiniLabel: 'Risc impuls:',
    wishlistMarkBought: 'Marchează ca cumpărat',
    wishlistDismiss: 'Respinge',
    wishlistDelete: 'Șterge',
    'risk.low': 'Scăzut',
    'risk.medium': 'Mediu',
    'risk.high': 'Ridicat',
    'status.active': 'activ',
    'status.bought': 'cumpărat',
    'status.dismissed': 'respins',
    'impulseDetail.low': 'Contextul indică un risc redus de cumpărare impulsivă.',
    'impulseDetail.medium': 'Există câteva semnale de impuls. Merită o pauză scurtă înainte de a decide.',
    'impulseDetail.high': 'Semnalele comportamentale arată că această decizie poate fi impulsivă.',
    'goal.noGoal': 'Fără obiectiv setat',
    'goal.completed': 'Obiectivul „{goal}” este deja acoperit',
    'goal.all': 'Ar consuma toată suma rămasă pentru „{goal}”',
    'goal.partial': 'Ar consuma {value}% din suma rămasă pentru „{goal}”',
    explanationPositiveWithItems: 'În favoarea cumpărăturii: {items}.',
    explanationPositiveNone: 'Nu există suficiente semnale puternice în favoarea cumpărăturii.',
    explanationCautionWithItems: 'Semnale de atenție: {items}.',
    explanationCautionNone: 'Nu apar semnale majore de risc în contextul actual.',
    explanationBuyPrefix: 'Verdictul este pozitiv.',
    explanationWaitPrefix: 'Produsul nu este respins, dar momentul nu pare ideal.',
    explanationSkipPrefix: 'Momentan nu merită să cumperi.',
    'positive.realNeed': 'pare o nevoie reală',
    'positive.frequentUse': 'îl vei folosi frecvent',
    'positive.longTermValue': 'are valoare bună pe termen lung',
    'positive.notRushed': 'nu arată ca o decizie luată pe fugă',
    'positive.moderateIncomeImpact': 'are impact moderat asupra venitului lunar',
    'caution.heavyIncomeImpact': 'costul apasă vizibil pe venitul lunar',
    'caution.heavySavingsImpact': 'mușcă serios din economii',
    'caution.hasAlternative': 'ai deja o alternativă',
    'caution.highImpulse': 'contextul arată risc mare de impuls',
    'caution.goalConflict': 'îți încetinește obiectivul financiar',
    'caution.tooSoon': 'îl vrei de foarte puțin timp',
    noSavedExplanation: 'Explicația detaliată nu este disponibilă pentru această analiză mai veche.',
    noCategory: '—',
    hoursFormat: '{value} h',
    'language.ro': 'Română',
    'language.en': 'English',
  },
  en: {
    metaTitle: 'WorthIt — Shopping Decision Helper',
    metaDescription:
      'WorthIt helps you decide whether a product is worth buying based on your financial and behavioral context.',
    heroEyebrow: 'Shopping Decision Helper',
    heroSubtitle:
      'Run every purchase through the filter of real need, financial impact and impulse risk.',
    languageLabel: 'Language',
    currencyLabel: 'Currency',
    settingsNote: 'All amounts in the form, dashboard and history use the selected currency.',
    analyzePurchaseBtn: 'Analyze a purchase',
    seeDashboardBtn: 'View dashboard',
    heroPanelTitle: 'Clearer decisions, less impulse',
    analysesSaved: 'saved analyses',
    avoidedEstimated: 'estimated money avoided',
    heroNote: 'A local MVP with no backend, deterministic logic and data stored in the browser.',
    dashboardEyebrow: 'Dashboard',
    dashboardTitle: 'Quick overview',
    totalAnalyses: 'Total analyses',
    acceptedPurchases: 'Approved purchases',
    postponedPurchases: 'Postponed purchases',
    rejectedPurchases: 'Rejected purchases',
    moneyAvoided: 'Money avoided',
    recentDecisions: 'Recent decisions',
    recentAnalyses: 'Latest analyses',
    wishlistTitle: 'Wishlist',
    wishlistCaption: 'Saved products for later',
    insightsEyebrow: 'Insights',
    insightsTitle: 'What your decisions say',
    totalDecisions: 'Total decisions',
    accepted: 'Accepted',
    postponed: 'Postponed',
    rejected: 'Rejected',
    topRejectedCategoryLabel: 'Most rejected category',
    verdictDistribution: 'Verdict distribution',
    buyVerdict: 'Buy',
    waitVerdict: 'Wait',
    skipVerdict: 'Do not buy now',
    analysisEyebrow: 'Analysis',
    analysisTitle: 'Analyze a purchase',
    productNameLabel: 'Product name',
    productNamePlaceholder: 'e.g. Noise cancelling headphones',
    priceLabel: 'Price',
    categoryLabel: 'Category',
    selectOption: 'Select',
    'category.electronics': 'Electronics',
    'category.home': 'Home',
    'category.clothing': 'Clothing',
    'category.education': 'Education',
    'category.health': 'Health',
    'category.hobby': 'Hobby',
    'category.travel': 'Travel',
    'category.gifts': 'Gifts',
    'category.other': 'Other',
    reasonLabel: 'Why do you want to buy it?',
    reasonPlaceholder: 'Write the main reason',
    behavioralScoresTitle: 'Behavioral scores',
    scoresLegend: '1 = very low, 10 = very high',
    necessityLabel: 'Necessity',
    necessityHint: 'How necessary is it?',
    urgencyLabel: 'Urgency',
    urgencyHint: 'How urgent is it right now?',
    frequencyLabel: 'Frequency',
    frequencyHint: 'How often will you use it?',
    longTermValueLabel: 'Long-term value',
    longTermValueHint: 'How much value does it bring over time?',
    hasAlternativeLabel: 'I already have a reasonable alternative',
    daysWantedLabel: 'How many days have you wanted it?',
    moodLabel: 'Current mood',
    'mood.neutral': 'neutral',
    'mood.calm': 'calm',
    'mood.stressed': 'stressed',
    'mood.bored': 'bored',
    'mood.excited': 'excited',
    'mood.sad': 'sad',
    financialContextTitle: 'Financial context',
    financialContextHint: 'Data stays local in your browser',
    monthlyIncomeLabel: 'Monthly income',
    monthlyBudgetLabel: 'Available monthly budget',
    savingsLabel: 'Savings',
    hourlyIncomeLabel: 'Hourly income',
    mainGoalNameLabel: 'Main financial goal',
    mainGoalNamePlaceholder: 'e.g. Emergency fund',
    mainGoalTargetLabel: 'Goal target',
    mainGoalCurrentLabel: 'Current progress (optional)',
    calculateVerdictBtn: 'Calculate verdict',
    resetFormBtn: 'Reset form',
    resultEmptyTitle: 'Your analysis result appears here',
    resultEmptyText:
      'Fill in the form and you will get a final score, a clear verdict and a summary of the financial impact.',
    finalScoreLabel: 'Final score',
    verdictLabel: 'Verdict',
    explanationLabel: 'Explanation',
    financialImpactLabel: 'Financial impact',
    incomePercentLabel: '% of monthly income',
    savingsPercentLabel: '% of savings',
    hoursOfWorkLabel: 'Hours of work needed',
    goalImpactLabel: 'Impact on your goal',
    impulseRiskLabel: 'Impulse risk',
    addToWishlistBtn: 'Add to wishlist',
    analyzeAnotherBtn: 'Analyze another product',
    emptyHistory: 'There are no saved decisions yet.',
    emptyWishlist: 'The wishlist is empty for now.',
    scoreMiniLabel: 'Score:',
    impulseMiniLabel: 'Impulse risk:',
    wishlistMarkBought: 'Mark as bought',
    wishlistDismiss: 'Dismiss',
    wishlistDelete: 'Delete',
    'risk.low': 'Low',
    'risk.medium': 'Medium',
    'risk.high': 'High',
    'status.active': 'active',
    'status.bought': 'bought',
    'status.dismissed': 'dismissed',
    'impulseDetail.low': 'The context points to a low risk of impulse buying.',
    'impulseDetail.medium': 'There are a few impulse signals. A short pause is worth it before deciding.',
    'impulseDetail.high': 'The behavioral signals suggest this decision may be impulsive.',
    'goal.noGoal': 'No goal set',
    'goal.completed': 'Your “{goal}” goal is already covered',
    'goal.all': 'It would consume the entire remaining amount for “{goal}”',
    'goal.partial': 'It would consume {value}% of the remaining amount for “{goal}”',
    explanationPositiveWithItems: 'In favor of buying: {items}.',
    explanationPositiveNone: 'There are not enough strong signals in favor of this purchase.',
    explanationCautionWithItems: 'Watch-outs: {items}.',
    explanationCautionNone: 'There are no major risk signals in the current context.',
    explanationBuyPrefix: 'The verdict is positive.',
    explanationWaitPrefix: 'The product is not rejected, but the timing does not look ideal.',
    explanationSkipPrefix: 'For now, it is not worth buying.',
    'positive.realNeed': 'it looks like a real need',
    'positive.frequentUse': 'you will use it often',
    'positive.longTermValue': 'it has solid long-term value',
    'positive.notRushed': 'it does not look like a rushed decision',
    'positive.moderateIncomeImpact': 'the impact on monthly income looks moderate',
    'caution.heavyIncomeImpact': 'the cost weighs noticeably on your monthly income',
    'caution.heavySavingsImpact': 'it takes a serious bite out of your savings',
    'caution.hasAlternative': 'you already have an alternative',
    'caution.highImpulse': 'the context shows high impulse risk',
    'caution.goalConflict': 'it slows down your financial goal',
    'caution.tooSoon': 'you have wanted it for a very short time',
    noSavedExplanation: 'A detailed explanation is not available for this older analysis.',
    noCategory: '—',
    hoursFormat: '{value} hrs',
    'language.ro': 'Romanian',
    'language.en': 'English',
  },
};

const appState = {
  settings: { ...DEFAULT_SETTINGS },
  latestAnalysis: null,
};

const elements = {
  purchaseForm: document.getElementById('purchaseForm'),
  resetFormBtn: document.getElementById('resetFormBtn'),
  startAnalysisBtn: document.getElementById('startAnalysisBtn'),
  analyzeAnotherBtn: document.getElementById('analyzeAnotherBtn'),
  addToWishlistBtn: document.getElementById('addToWishlistBtn'),
  languageSelect: document.getElementById('languageSelect'),
  currencySelect: document.getElementById('currencySelect'),
  metaDescription: document.querySelector('meta[name="description"]'),
  resultPanel: document.getElementById('resultPanel'),
  resultEmptyState: document.getElementById('resultEmptyState'),
  resultContent: document.getElementById('resultContent'),
  historyList: document.getElementById('historyList'),
  wishlistList: document.getElementById('wishlistList'),
  historyTemplate: document.getElementById('historyItemTemplate'),
  wishlistTemplate: document.getElementById('wishlistItemTemplate'),
  heroMetricScore: document.getElementById('heroMetricScore'),
  heroMetricSavings: document.getElementById('heroMetricSavings'),
  totalDecisionsCard: document.getElementById('totalDecisionsCard'),
  acceptedCard: document.getElementById('acceptedCard'),
  postponedCard: document.getElementById('postponedCard'),
  rejectedCard: document.getElementById('rejectedCard'),
  avoidedMoneyCard: document.getElementById('avoidedMoneyCard'),
  insightTotal: document.getElementById('insightTotal'),
  insightAccepted: document.getElementById('insightAccepted'),
  insightPostponed: document.getElementById('insightPostponed'),
  insightRejected: document.getElementById('insightRejected'),
  insightAvoided: document.getElementById('insightAvoided'),
  topRejectedCategory: document.getElementById('topRejectedCategory'),
  buyBarValue: document.getElementById('buyBarValue'),
  waitBarValue: document.getElementById('waitBarValue'),
  skipBarValue: document.getElementById('skipBarValue'),
  buyBarFill: document.getElementById('buyBarFill'),
  waitBarFill: document.getElementById('waitBarFill'),
  skipBarFill: document.getElementById('skipBarFill'),
  finalScoreDisplay: document.getElementById('finalScoreDisplay'),
  verdictBox: document.getElementById('verdictBox'),
  verdictText: document.getElementById('verdictText'),
  explanationText: document.getElementById('explanationText'),
  costIncomeText: document.getElementById('costIncomeText'),
  costSavingsText: document.getElementById('costSavingsText'),
  hoursWorkText: document.getElementById('hoursWorkText'),
  goalImpactText: document.getElementById('goalImpactText'),
  impulseRiskBadge: document.getElementById('impulseRiskBadge'),
  impulseRiskDetail: document.getElementById('impulseRiskDetail'),
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function interpolate(template, variables = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => String(variables[key] ?? ''));
}

function t(key, variables = {}) {
  const language = appState.settings.language;
  const pack = LOCALES[language] || LOCALES.ro;
  const fallback = LOCALES.ro[key] ?? key;
  return interpolate(pack[key] ?? fallback, variables);
}

function normalizeToken(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function roundMoney(value) {
  const rounded = Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  if (!Number.isFinite(rounded)) return '0';
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

function formatCurrency(value, currency = appState.settings.currency) {
  const locale = appState.settings.language === 'ro' ? 'ro-RO' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value || 0);
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function formatHours(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '—';
  }

  return t('hoursFormat', { value: value.toFixed(1) });
}

function formatDate(value) {
  const locale = appState.settings.language === 'ro' ? 'ro-RO' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function convertAmount(value, fromCurrency, toCurrency) {
  const amount = toNumber(value);
  const fromRate = CURRENCY_RATES[fromCurrency] || CURRENCY_RATES.RON;
  const toRate = CURRENCY_RATES[toCurrency] || CURRENCY_RATES.RON;
  return (amount * fromRate) / toRate;
}

function formatStoredAmount(value, sourceCurrency = 'RON') {
  return formatCurrency(convertAmount(value, sourceCurrency, appState.settings.currency));
}

function setStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStorageItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function getProfile() {
  return {
    ...DEFAULT_SETTINGS,
    ...getStorageItem(STORAGE_KEYS.profile, {}),
  };
}

function saveProfile(profilePatch) {
  const currentProfile = getProfile();
  setStorageItem(STORAGE_KEYS.profile, {
    ...currentProfile,
    ...profilePatch,
  });
}

function getDecisions() {
  return getStorageItem(STORAGE_KEYS.decisions, []);
}

function saveDecision(decision) {
  const decisions = getDecisions();
  decisions.unshift(decision);
  setStorageItem(STORAGE_KEYS.decisions, decisions.slice(0, 100));
}

function getWishlist() {
  return getStorageItem(STORAGE_KEYS.wishlist, []);
}

function saveWishlistItem(item) {
  const wishlist = getWishlist();
  wishlist.unshift(item);
  setStorageItem(STORAGE_KEYS.wishlist, wishlist.slice(0, 100));
}

function updateWishlistStatus(itemId, statusKey) {
  const wishlist = getWishlist().map((item) => {
    if (item.id !== itemId) return item;
    return { ...item, statusKey };
  });

  setStorageItem(STORAGE_KEYS.wishlist, wishlist);
}

function deleteWishlistItem(itemId) {
  const wishlist = getWishlist().filter((item) => item.id !== itemId);
  setStorageItem(STORAGE_KEYS.wishlist, wishlist);
}

function normalizeVerdictKey(value) {
  const token = normalizeToken(value);

  if (token === 'buy' || token === 'cumpara' || token === 'cumpara acum') return 'buy';
  if (token === 'wait' || token === 'mai asteapta' || token === 'mai asteapta putin') return 'wait';
  if (token === 'skip' || token === 'do not buy now' || token === 'nu cumpara acum') return 'skip';

  return 'skip';
}

function normalizeRiskKey(value) {
  const token = normalizeToken(value);

  if (token === 'low' || token === 'scazut') return 'low';
  if (token === 'medium' || token === 'mediu') return 'medium';
  if (token === 'high' || token === 'ridicat') return 'high';

  return 'low';
}

function normalizeStatusKey(value) {
  const token = normalizeToken(value);

  if (token === 'active' || token === 'activ') return 'active';
  if (token === 'bought' || token === 'cumparat') return 'bought';
  if (token === 'dismissed' || token === 'respins' || token === 'rejected') return 'dismissed';

  return 'active';
}

function normalizeCategoryKey(value) {
  const token = normalizeToken(value);
  const map = {
    electronics: 'electronics',
    electronice: 'electronics',
    home: 'home',
    casa: 'home',
    clothing: 'clothing',
    imbracaminte: 'clothing',
    education: 'education',
    educatie: 'education',
    health: 'health',
    sanatate: 'health',
    hobby: 'hobby',
    travel: 'travel',
    calatorii: 'travel',
    gifts: 'gifts',
    cadouri: 'gifts',
    other: 'other',
    altceva: 'other',
  };

  return map[token] || 'other';
}

function getVerdictText(verdictKey) {
  return t(VERDICT_LABEL_KEYS[verdictKey] || VERDICT_LABEL_KEYS.skip);
}

function getRiskText(riskKey) {
  return t(RISK_LABEL_KEYS[riskKey] || RISK_LABEL_KEYS.low);
}

function getStatusText(statusKey) {
  return t(STATUS_LABEL_KEYS[statusKey] || STATUS_LABEL_KEYS.active);
}

function getCategoryText(categoryKey, fallbackText = '') {
  if (!categoryKey && fallbackText) return fallbackText;
  return t(`category.${categoryKey}`) || fallbackText || t('category.other');
}

function getDisplayCategory(item) {
  const key = item.categoryKey || normalizeCategoryKey(item.category);
  return getCategoryText(key, item.category || t('noCategory'));
}

function getIncomePenalty(percent) {
  if (percent <= 5) return 0;
  if (percent <= 10) return 4;
  if (percent <= 20) return 9;
  if (percent <= 35) return 14;
  return 20;
}

function getSavingsPenalty(percent, savings) {
  if (savings <= 0) return 12;
  if (percent <= 5) return 0;
  if (percent <= 10) return 2;
  if (percent <= 25) return 6;
  if (percent <= 50) return 12;
  return 18;
}

function getBudgetPenalty(price, monthlyBudget) {
  if (monthlyBudget <= 0) return 8;

  const ratio = (price / monthlyBudget) * 100;
  if (ratio <= 35) return 0;
  if (ratio <= 60) return 4;
  if (ratio <= 100) return 8;
  return 14;
}

function getGoalPenalty(price, target, current) {
  if (target <= 0) return 0;

  const remaining = Math.max(target - current, 0);
  if (remaining <= 0) return 0;

  const goalShare = (price / remaining) * 100;
  if (goalShare <= 5) return 0;
  if (goalShare <= 15) return 3;
  if (goalShare <= 30) return 7;
  return 12;
}

function calculateImpulseRisk(data) {
  let flags = 0;

  if (data.daysWanted <= 2) flags += 1;
  if (data.necessityScore <= 5) flags += 1;
  if (data.urgencyScore <= 4) flags += 1;
  if (data.hasAlternative) flags += 1;
  if (IMPULSE_MOODS.includes(data.mood)) flags += 1;

  if (flags >= 3) return 'high';
  if (flags === 2) return 'medium';
  return 'low';
}

function getGoalImpactText(data, price, language = appState.settings.language) {
  const currentLanguage = appState.settings.language;
  appState.settings.language = language;

  let text = t('goal.noGoal');

  if (data.mainGoalName && data.mainGoalTarget > 0) {
    const remaining = Math.max(data.mainGoalTarget - data.mainGoalCurrent, 0);

    if (remaining <= 0) {
      text = t('goal.completed', { goal: data.mainGoalName });
    } else {
      const shareOfRemaining = (price / remaining) * 100;
      text = shareOfRemaining >= 100
        ? t('goal.all', { goal: data.mainGoalName })
        : t('goal.partial', { value: shareOfRemaining.toFixed(1), goal: data.mainGoalName });
    }
  }

  appState.settings.language = currentLanguage;
  return text;
}

function generateExplanation(result, data, language = appState.settings.language) {
  const currentLanguage = appState.settings.language;
  appState.settings.language = language;

  const positives = [];
  const cautions = [];

  if (data.necessityScore >= 8) positives.push(t('positive.realNeed'));
  if (data.frequencyScore >= 7) positives.push(t('positive.frequentUse'));
  if (data.longTermValueScore >= 8) positives.push(t('positive.longTermValue'));
  if (data.daysWanted >= 7) positives.push(t('positive.notRushed'));
  if (result.costVsIncomePercent <= 8) positives.push(t('positive.moderateIncomeImpact'));

  if (result.costVsIncomePercent > 15) cautions.push(t('caution.heavyIncomeImpact'));
  if (result.costVsSavingsPercent > 20) cautions.push(t('caution.heavySavingsImpact'));
  if (data.hasAlternative) cautions.push(t('caution.hasAlternative'));
  if (result.impulseRiskKey === 'high') cautions.push(t('caution.highImpulse'));
  if (data.mainGoalTarget > 0 && result.goalPenalty > 0) cautions.push(t('caution.goalConflict'));
  if (data.daysWanted <= 2) cautions.push(t('caution.tooSoon'));

  const positiveText = positives.length
    ? t('explanationPositiveWithItems', { items: positives.slice(0, 3).join(', ') })
    : t('explanationPositiveNone');

  const cautionText = cautions.length
    ? t('explanationCautionWithItems', { items: cautions.slice(0, 3).join(', ') })
    : t('explanationCautionNone');

  let prefix = t('explanationSkipPrefix');
  if (result.verdictKey === 'buy') prefix = t('explanationBuyPrefix');
  if (result.verdictKey === 'wait') prefix = t('explanationWaitPrefix');

  appState.settings.language = currentLanguage;
  return `${prefix} ${positiveText} ${cautionText}`;
}

function getImpulseDetail(riskKey) {
  return t(`impulseDetail.${riskKey}`);
}

function evaluatePurchase(data) {
  const costVsIncomePercent = data.monthlyIncome > 0 ? (data.price / data.monthlyIncome) * 100 : 100;
  const costVsSavingsPercent = data.savings > 0 ? (data.price / data.savings) * 100 : 100;
  const hoursOfWork = data.hourlyIncome > 0 ? data.price / data.hourlyIncome : 0;

  const urgencyBalance = clamp(10 - Math.abs(data.urgencyScore - 6) * 2, 0, 10);
  const patienceBonus = clamp((Math.min(data.daysWanted, 30) / 30) * 8, 0, 8);
  const budgetComfort = data.monthlyBudget > 0
    ? clamp(((data.monthlyBudget - data.price) / data.monthlyBudget) * 8, 0, 8)
    : 0;

  const positiveScore =
    data.necessityScore * 2.2 +
    data.frequencyScore * 1.5 +
    data.longTermValueScore * 2 +
    urgencyBalance * 1.1 +
    patienceBonus +
    budgetComfort;

  const incomePenalty = getIncomePenalty(costVsIncomePercent);
  const savingsPenalty = getSavingsPenalty(costVsSavingsPercent, data.savings);
  const budgetPenalty = getBudgetPenalty(data.price, data.monthlyBudget);
  const goalPenalty = getGoalPenalty(data.price, data.mainGoalTarget, data.mainGoalCurrent);
  const alternativePenalty = data.hasAlternative ? 8 : 0;
  const impulseRiskKey = calculateImpulseRisk(data);
  const impulsePenalty = impulseRiskKey === 'high' ? 12 : impulseRiskKey === 'medium' ? 6 : 0;
  const shortWindowPenalty = data.daysWanted <= 2 ? 5 : data.daysWanted <= 7 ? 2 : 0;
  const moodPenalty = IMPULSE_MOODS.includes(data.mood) ? 5 : data.mood === 'sad' ? 3 : 0;

  const rawScore =
    positiveScore -
    incomePenalty -
    savingsPenalty -
    budgetPenalty -
    goalPenalty -
    alternativePenalty -
    impulsePenalty -
    shortWindowPenalty -
    moodPenalty +
    10;

  const finalScore = Math.round(clamp(rawScore, 0, 100));
  let verdictKey = 'skip';

  if (finalScore >= 75) {
    verdictKey = 'buy';
  } else if (finalScore >= 50) {
    verdictKey = 'wait';
  }

  return {
    finalScore,
    verdictKey,
    impulseRiskKey,
    costVsIncomePercent,
    costVsSavingsPercent,
    hoursOfWork,
    goalPenalty,
  };
}

function readFormData() {
  const formData = new FormData(elements.purchaseForm);

  return {
    productName: String(formData.get('productName') || '').trim(),
    price: toNumber(formData.get('price')),
    categoryKey: normalizeCategoryKey(formData.get('category')),
    reason: String(formData.get('reason') || '').trim(),
    necessityScore: toNumber(formData.get('necessityScore')),
    urgencyScore: toNumber(formData.get('urgencyScore')),
    frequencyScore: toNumber(formData.get('frequencyScore')),
    longTermValueScore: toNumber(formData.get('longTermValueScore')),
    hasAlternative: Boolean(formData.get('hasAlternative')),
    daysWanted: toNumber(formData.get('daysWanted')),
    mood: String(formData.get('mood') || 'neutral').trim(),
    monthlyIncome: toNumber(formData.get('monthlyIncome')),
    monthlyBudget: toNumber(formData.get('monthlyBudget')),
    savings: toNumber(formData.get('savings')),
    hourlyIncome: toNumber(formData.get('hourlyIncome')),
    mainGoalName: String(formData.get('mainGoalName') || '').trim(),
    mainGoalTarget: toNumber(formData.get('mainGoalTarget')),
    mainGoalCurrent: toNumber(formData.get('mainGoalCurrent')),
  };
}

function buildDecisionRecord(data, result) {
  return {
    id: createId(),
    productName: data.productName,
    price: data.price,
    currency: appState.settings.currency,
    categoryKey: data.categoryKey,
    finalScore: result.finalScore,
    verdictKey: result.verdictKey,
    explanation: generateExplanation(result, data, appState.settings.language),
    impulseRiskKey: result.impulseRiskKey,
    dateCreated: new Date().toISOString(),
    analysisData: { ...data },
    analysisResult: { ...result },
  };
}

function getVerdictClass(verdictKey) {
  if (verdictKey === 'buy') return 'is-buy';
  if (verdictKey === 'wait') return 'is-wait';
  return 'is-skip';
}

function getWishlistStatusClass(statusKey) {
  if (statusKey === 'bought') return 'is-bought';
  if (statusKey === 'dismissed') return 'is-dismissed';
  return 'is-active';
}

function renderOverview() {
  const decisions = getDecisions();
  const accepted = decisions.filter((item) => (item.verdictKey || normalizeVerdictKey(item.verdict)) === 'buy').length;
  const postponed = decisions.filter((item) => (item.verdictKey || normalizeVerdictKey(item.verdict)) === 'wait').length;
  const rejected = decisions.filter((item) => (item.verdictKey || normalizeVerdictKey(item.verdict)) === 'skip').length;
  const avoidedMoney = decisions
    .filter((item) => (item.verdictKey || normalizeVerdictKey(item.verdict)) !== 'buy')
    .reduce((sum, item) => sum + convertAmount(item.price, item.currency || 'RON', appState.settings.currency), 0);

  elements.heroMetricScore.textContent = decisions.length;
  elements.heroMetricSavings.textContent = formatCurrency(avoidedMoney);
  elements.totalDecisionsCard.textContent = decisions.length;
  elements.acceptedCard.textContent = accepted;
  elements.postponedCard.textContent = postponed;
  elements.rejectedCard.textContent = rejected;
  elements.avoidedMoneyCard.textContent = formatCurrency(avoidedMoney);
}

function renderHistory() {
  const decisions = getDecisions().slice(0, 6);
  elements.historyList.innerHTML = '';

  if (!decisions.length) {
    elements.historyList.innerHTML = `<div class="empty-state">${t('emptyHistory')}</div>`;
    return;
  }

  decisions.forEach((decision) => {
    const fragment = elements.historyTemplate.content.cloneNode(true);
    const item = fragment.querySelector('.history-item');
    const title = fragment.querySelector('.item-title');
    const meta = fragment.querySelector('.item-meta');
    const description = fragment.querySelector('.item-description');
    const verdictPill = fragment.querySelector('.verdict-pill');
    const score = fragment.querySelector('.history-score');
    const risk = fragment.querySelector('.history-risk');
    const scoreLabel = fragment.querySelector('[data-mini-label="score"]');
    const riskLabel = fragment.querySelector('[data-mini-label="risk"]');

    const verdictKey = decision.verdictKey || normalizeVerdictKey(decision.verdict);
    const impulseRiskKey = decision.impulseRiskKey || normalizeRiskKey(decision.impulseRisk);
    const explanation = decision.analysisData && decision.analysisResult
      ? generateExplanation(decision.analysisResult, decision.analysisData)
      : decision.explanation || t('noSavedExplanation');

    title.textContent = decision.productName;
    meta.textContent = `${getDisplayCategory(decision)} · ${formatStoredAmount(decision.price, decision.currency || 'RON')} · ${formatDate(decision.dateCreated)}`;
    description.textContent = explanation;
    scoreLabel.textContent = t('scoreMiniLabel');
    riskLabel.textContent = t('impulseMiniLabel');
    score.textContent = `${toNumber(decision.finalScore)}/100`;
    risk.textContent = getRiskText(impulseRiskKey);
    verdictPill.textContent = getVerdictText(verdictKey);
    verdictPill.classList.add(getVerdictClass(verdictKey));

    item.dataset.id = decision.id;
    elements.historyList.appendChild(fragment);
  });
}

function renderWishlist() {
  const wishlist = getWishlist();
  elements.wishlistList.innerHTML = '';

  if (!wishlist.length) {
    elements.wishlistList.innerHTML = `<div class="empty-state">${t('emptyWishlist')}</div>`;
    return;
  }

  wishlist.forEach((itemData) => {
    const fragment = elements.wishlistTemplate.content.cloneNode(true);
    const item = fragment.querySelector('.wishlist-item');
    const title = fragment.querySelector('.item-title');
    const meta = fragment.querySelector('.item-meta');
    const status = fragment.querySelector('.wishlist-status');
    const actions = fragment.querySelector('.item-card-actions');

    const statusKey = itemData.statusKey || normalizeStatusKey(itemData.status);

    title.textContent = itemData.productName;
    meta.textContent = `${getDisplayCategory(itemData)} · ${formatStoredAmount(itemData.price, itemData.currency || 'RON')}`;
    status.textContent = getStatusText(statusKey);
    status.classList.add(getWishlistStatusClass(statusKey));
    item.dataset.id = itemData.id;

    if (statusKey !== 'bought') {
      const boughtButton = document.createElement('button');
      boughtButton.type = 'button';
      boughtButton.className = 'btn btn-secondary btn-small';
      boughtButton.dataset.action = 'bought';
      boughtButton.dataset.id = itemData.id;
      boughtButton.textContent = t('wishlistMarkBought');
      actions.appendChild(boughtButton);
    }

    if (statusKey !== 'dismissed') {
      const dismissButton = document.createElement('button');
      dismissButton.type = 'button';
      dismissButton.className = 'btn btn-ghost btn-small';
      dismissButton.dataset.action = 'dismiss';
      dismissButton.dataset.id = itemData.id;
      dismissButton.textContent = t('wishlistDismiss');
      actions.appendChild(dismissButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-ghost btn-small';
    deleteButton.dataset.action = 'delete';
    deleteButton.dataset.id = itemData.id;
    deleteButton.textContent = t('wishlistDelete');
    actions.appendChild(deleteButton);

    elements.wishlistList.appendChild(fragment);
  });
}

function renderInsights() {
  const decisions = getDecisions();
  const accepted = decisions.filter((item) => (item.verdictKey || normalizeVerdictKey(item.verdict)) === 'buy').length;
  const postponed = decisions.filter((item) => (item.verdictKey || normalizeVerdictKey(item.verdict)) === 'wait').length;
  const rejected = decisions.filter((item) => (item.verdictKey || normalizeVerdictKey(item.verdict)) === 'skip').length;
  const avoidedMoney = decisions
    .filter((item) => (item.verdictKey || normalizeVerdictKey(item.verdict)) !== 'buy')
    .reduce((sum, item) => sum + convertAmount(item.price, item.currency || 'RON', appState.settings.currency), 0);

  const rejectedCategories = decisions
    .filter((item) => (item.verdictKey || normalizeVerdictKey(item.verdict)) === 'skip')
    .reduce((accumulator, item) => {
      const categoryKey = item.categoryKey || normalizeCategoryKey(item.category);
      accumulator[categoryKey] = (accumulator[categoryKey] || 0) + 1;
      return accumulator;
    }, {});

  const topRejectedCategoryKey = Object.entries(rejectedCategories)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  const total = decisions.length;
  const base = total || 1;
  const buyPercent = Math.round((accepted / base) * 100);
  const waitPercent = Math.round((postponed / base) * 100);
  const skipPercent = Math.round((rejected / base) * 100);

  elements.insightTotal.textContent = total;
  elements.insightAccepted.textContent = accepted;
  elements.insightPostponed.textContent = postponed;
  elements.insightRejected.textContent = rejected;
  elements.insightAvoided.textContent = formatCurrency(avoidedMoney);
  elements.topRejectedCategory.textContent = topRejectedCategoryKey ? getCategoryText(topRejectedCategoryKey) : t('noCategory');

  elements.buyBarValue.textContent = `${buyPercent}%`;
  elements.waitBarValue.textContent = `${waitPercent}%`;
  elements.skipBarValue.textContent = `${skipPercent}%`;

  elements.buyBarFill.style.width = `${buyPercent}%`;
  elements.waitBarFill.style.width = `${waitPercent}%`;
  elements.skipBarFill.style.width = `${skipPercent}%`;
}

function renderResult(result, data) {
  elements.resultEmptyState.classList.add('hidden');
  elements.resultContent.classList.remove('hidden');

  elements.finalScoreDisplay.textContent = result.finalScore;
  elements.verdictText.textContent = getVerdictText(result.verdictKey);
  elements.verdictBox.className = `verdict-box ${getVerdictClass(result.verdictKey)}`;
  elements.explanationText.textContent = generateExplanation(result, data);
  elements.costIncomeText.textContent = formatPercent(result.costVsIncomePercent);
  elements.costSavingsText.textContent = formatPercent(result.costVsSavingsPercent);
  elements.hoursWorkText.textContent = formatHours(result.hoursOfWork);
  elements.goalImpactText.textContent = getGoalImpactText(data, data.price);
  elements.impulseRiskBadge.textContent = getRiskText(result.impulseRiskKey);
  elements.impulseRiskBadge.className = 'risk-badge';

  if (result.impulseRiskKey === 'high') {
    elements.impulseRiskBadge.classList.add('risk-high');
  } else if (result.impulseRiskKey === 'medium') {
    elements.impulseRiskBadge.classList.add('risk-medium');
  } else {
    elements.impulseRiskBadge.classList.add('risk-low');
  }

  elements.impulseRiskDetail.textContent = getImpulseDetail(result.impulseRiskKey);
}

function clearResult() {
  appState.latestAnalysis = null;
  elements.resultEmptyState.classList.remove('hidden');
  elements.resultContent.classList.add('hidden');
  elements.verdictBox.className = 'verdict-box';
}

function renderDashboard() {
  renderOverview();
  renderHistory();
  renderWishlist();
  renderInsights();
}

function fillProfileFields(profile) {
  PROFILE_FIELDS.forEach((field) => {
    const input = document.querySelector(`[name="${field}"]`);
    if (!input || profile[field] === undefined || profile[field] === null || profile[field] === '') return;
    input.value = profile[field];
  });
}

function saveProfileFromForm() {
  const profilePatch = PROFILE_FIELDS.reduce((accumulator, field) => {
    const input = document.querySelector(`[name="${field}"]`);
    accumulator[field] = input ? input.value : '';
    return accumulator;
  }, {});

  saveProfile({
    ...profilePatch,
    language: appState.settings.language,
    currency: appState.settings.currency,
  });
}

function resetForm(keepProfile = true) {
  const profile = keepProfile ? getProfile() : {};
  elements.purchaseForm.reset();

  document.querySelectorAll('input[type="range"]').forEach((range) => {
    range.value = 5;
    const output = document.getElementById(`${range.id}Output`);
    if (output) output.textContent = '5';
  });

  if (keepProfile) {
    fillProfileFields(profile);
  }
}

function syncSettingsControls() {
  elements.languageSelect.value = appState.settings.language;
  elements.currencySelect.value = appState.settings.currency;
  elements.languageSelect.options[0].textContent = t('language.ro');
  elements.languageSelect.options[1].textContent = t('language.en');
}

function applyTranslations() {
  document.documentElement.lang = appState.settings.language;
  document.title = t('metaTitle');
  if (elements.metaDescription) {
    elements.metaDescription.setAttribute('content', t('metaDescription'));
  }

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder));
  });

  syncSettingsControls();
}

function initRangeOutputs() {
  document.querySelectorAll('input[type="range"]').forEach((range) => {
    const output = document.getElementById(`${range.id}Output`);
    if (output) output.textContent = range.value;

    range.addEventListener('input', () => {
      if (output) output.textContent = range.value;
    });
  });
}

function initProfilePersistence() {
  fillProfileFields(getProfile());

  PROFILE_FIELDS.forEach((field) => {
    const input = document.querySelector(`[name="${field}"]`);
    if (!input) return;
    input.addEventListener('change', saveProfileFromForm);
  });
}

function convertInputValues(fromCurrency, toCurrency) {
  CONVERTIBLE_FORM_FIELDS.forEach((field) => {
    const input = document.querySelector(`[name="${field}"]`);
    if (!input || input.value === '') return;

    const currentValue = toNumber(input.value);
    const convertedValue = convertAmount(currentValue, fromCurrency, toCurrency);
    input.value = roundMoney(convertedValue);
  });
}

function convertLatestAnalysisData(fromCurrency, toCurrency) {
  if (!appState.latestAnalysis) return;

  const nextData = { ...appState.latestAnalysis.data };
  CONVERTIBLE_FORM_FIELDS.forEach((field) => {
    if (field in nextData) {
      nextData[field] = convertAmount(nextData[field], fromCurrency, toCurrency);
    }
  });

  appState.latestAnalysis = {
    ...appState.latestAnalysis,
    data: nextData,
  };
}

function handleSubmit(event) {
  event.preventDefault();

  if (!elements.purchaseForm.reportValidity()) {
    return;
  }

  const data = readFormData();
  const result = evaluatePurchase(data);
  const decision = buildDecisionRecord(data, result);

  saveDecision(decision);
  saveProfileFromForm();

  appState.latestAnalysis = {
    data: { ...data },
    result: { ...result },
  };

  renderResult(result, data);
  renderDashboard();
  elements.resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleWishlistClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === 'bought') {
    updateWishlistStatus(id, 'bought');
  }

  if (action === 'dismiss') {
    updateWishlistStatus(id, 'dismissed');
  }

  if (action === 'delete') {
    deleteWishlistItem(id);
  }

  renderWishlist();
}

function handleAddToWishlist() {
  if (!appState.latestAnalysis) return;

  saveWishlistItem({
    id: createId(),
    productName: appState.latestAnalysis.data.productName,
    price: appState.latestAnalysis.data.price,
    currency: appState.settings.currency,
    categoryKey: appState.latestAnalysis.data.categoryKey,
    statusKey: 'active',
    createdAt: new Date().toISOString(),
  });

  renderWishlist();
}

function handleLanguageChange(event) {
  appState.settings.language = event.target.value;
  saveProfile({ language: appState.settings.language, currency: appState.settings.currency });
  applyTranslations();
  renderDashboard();

  if (appState.latestAnalysis) {
    renderResult(appState.latestAnalysis.result, appState.latestAnalysis.data);
  }
}

function handleCurrencyChange(event) {
  const nextCurrency = event.target.value;
  const currentCurrency = appState.settings.currency;

  if (nextCurrency === currentCurrency) return;

  convertInputValues(currentCurrency, nextCurrency);
  convertLatestAnalysisData(currentCurrency, nextCurrency);

  const currentProfile = getProfile();
  const convertedProfile = { ...currentProfile, currency: nextCurrency };
  PROFILE_MONEY_FIELDS.forEach((field) => {
    if (currentProfile[field] === undefined || currentProfile[field] === null || currentProfile[field] === '') return;
    convertedProfile[field] = roundMoney(convertAmount(currentProfile[field], currentCurrency, nextCurrency));
  });

  appState.settings.currency = nextCurrency;
  saveProfile({ ...convertedProfile, language: appState.settings.language });
  renderDashboard();

  if (appState.latestAnalysis) {
    renderResult(appState.latestAnalysis.result, appState.latestAnalysis.data);
  }
}

function migrateStoredData() {
  const profile = getProfile();
  saveProfile({
    language: profile.language || DEFAULT_SETTINGS.language,
    currency: profile.currency || DEFAULT_SETTINGS.currency,
  });

  const decisions = getStorageItem(STORAGE_KEYS.decisions, []).map((item) => ({
    id: item.id || createId(),
    productName: item.productName || '',
    price: toNumber(item.price),
    currency: item.currency || 'RON',
    categoryKey: item.categoryKey || normalizeCategoryKey(item.category),
    category: item.category || '',
    finalScore: toNumber(item.finalScore),
    verdictKey: item.verdictKey || normalizeVerdictKey(item.verdict),
    explanation: item.explanation || '',
    impulseRiskKey: item.impulseRiskKey || normalizeRiskKey(item.impulseRisk),
    dateCreated: item.dateCreated || new Date().toISOString(),
    analysisData: item.analysisData || null,
    analysisResult: item.analysisResult || null,
  }));

  const wishlist = getStorageItem(STORAGE_KEYS.wishlist, []).map((item) => ({
    id: item.id || createId(),
    productName: item.productName || '',
    price: toNumber(item.price),
    currency: item.currency || 'RON',
    categoryKey: item.categoryKey || normalizeCategoryKey(item.category),
    category: item.category || '',
    statusKey: item.statusKey || normalizeStatusKey(item.status),
    createdAt: item.createdAt || new Date().toISOString(),
  }));

  setStorageItem(STORAGE_KEYS.decisions, decisions.slice(0, 100));
  setStorageItem(STORAGE_KEYS.wishlist, wishlist.slice(0, 100));
}

function initEventListeners() {
  elements.purchaseForm.addEventListener('submit', handleSubmit);
  elements.resetFormBtn.addEventListener('click', () => {
    resetForm(true);
    clearResult();
  });
  elements.wishlistList.addEventListener('click', handleWishlistClick);
  elements.addToWishlistBtn.addEventListener('click', handleAddToWishlist);
  elements.analyzeAnotherBtn.addEventListener('click', () => {
    resetForm(true);
    clearResult();
    document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  elements.startAnalysisBtn.addEventListener('click', () => {
    document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  elements.languageSelect.addEventListener('change', handleLanguageChange);
  elements.currencySelect.addEventListener('change', handleCurrencyChange);
}

function init() {
  migrateStoredData();

  const profile = getProfile();
  appState.settings.language = profile.language || DEFAULT_SETTINGS.language;
  appState.settings.currency = profile.currency || DEFAULT_SETTINGS.currency;

  applyTranslations();
  initRangeOutputs();
  initProfilePersistence();
  initEventListeners();
  renderDashboard();
  clearResult();
}

init();
