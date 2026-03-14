const STORAGE_KEYS = {
  decisions: 'worthit_decisions',
  wishlist: 'worthit_wishlist',
  profile: 'worthit_profile',
};

const VERDICTS = {
  buy: 'Cumpără',
  wait: 'Mai așteaptă',
  skip: 'Nu cumpăra acum',
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

const appState = {
  latestAnalysis: null,
};

const elements = {
  purchaseForm: document.getElementById('purchaseForm'),
  resetFormBtn: document.getElementById('resetFormBtn'),
  startAnalysisBtn: document.getElementById('startAnalysisBtn'),
  analyzeAnotherBtn: document.getElementById('analyzeAnotherBtn'),
  addToWishlistBtn: document.getElementById('addToWishlistBtn'),
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

function formatCurrency(value) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
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

  return `${value.toFixed(1)} h`;
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('ro-RO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

function updateWishlistStatus(itemId, status) {
  const wishlist = getWishlist().map((item) => {
    if (item.id !== itemId) return item;
    return { ...item, status };
  });

  setStorageItem(STORAGE_KEYS.wishlist, wishlist);
}

function deleteWishlistItem(itemId) {
  const wishlist = getWishlist().filter((item) => item.id !== itemId);
  setStorageItem(STORAGE_KEYS.wishlist, wishlist);
}

function getProfile() {
  return getStorageItem(STORAGE_KEYS.profile, {});
}

function saveProfile(profilePatch) {
  const currentProfile = getProfile();
  setStorageItem(STORAGE_KEYS.profile, {
    ...currentProfile,
    ...profilePatch,
  });
}

function readFormData() {
  const formData = new FormData(elements.purchaseForm);

  return {
    productName: String(formData.get('productName') || '').trim(),
    price: toNumber(formData.get('price')),
    category: String(formData.get('category') || '').trim(),
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

  if (flags >= 3) return 'Ridicat';
  if (flags === 2) return 'Mediu';
  return 'Scăzut';
}

function getGoalImpactText(data, price) {
  if (!data.mainGoalName || data.mainGoalTarget <= 0) {
    return 'Fără obiectiv setat';
  }

  const remaining = Math.max(data.mainGoalTarget - data.mainGoalCurrent, 0);

  if (remaining <= 0) {
    return `Obiectivul „${data.mainGoalName}” este deja acoperit`;
  }

  const shareOfRemaining = (price / remaining) * 100;

  if (shareOfRemaining >= 100) {
    return `Ar consuma toată suma rămasă pentru „${data.mainGoalName}”`;
  }

  return `Ar consuma ${shareOfRemaining.toFixed(1)}% din suma rămasă pentru „${data.mainGoalName}”`;
}

function generateExplanation(result, data) {
  const positives = [];
  const cautions = [];

  if (data.necessityScore >= 8) positives.push('pare o nevoie reală');
  if (data.frequencyScore >= 7) positives.push('îl vei folosi frecvent');
  if (data.longTermValueScore >= 8) positives.push('are valoare bună pe termen lung');
  if (data.daysWanted >= 7) positives.push('nu arată ca o decizie luată pe fugă');
  if (result.costVsIncomePercent <= 8) positives.push('are impact moderat asupra venitului lunar');

  if (result.costVsIncomePercent > 15) cautions.push('costul apasă vizibil pe venitul lunar');
  if (result.costVsSavingsPercent > 20) cautions.push('mușcă serios din economii');
  if (data.hasAlternative) cautions.push('ai deja o alternativă');
  if (result.impulseRisk === 'Ridicat') cautions.push('contextul arată risc mare de impuls');
  if (data.mainGoalTarget > 0 && result.goalPenalty > 0) cautions.push('îți încetinește obiectivul financiar');
  if (data.daysWanted <= 2) cautions.push('îl vrei de foarte puțin timp');

  const positiveText = positives.length
    ? `În favoarea cumpărăturii: ${positives.slice(0, 3).join(', ')}.`
    : 'Nu există suficiente semnale puternice în favoarea cumpărăturii.';

  const cautionText = cautions.length
    ? `Semnale de atenție: ${cautions.slice(0, 3).join(', ')}.`
    : 'Nu apar semnale majore de risc în contextul actual.';

  if (result.verdict === VERDICTS.buy) {
    return `Verdictul este pozitiv. ${positiveText} ${cautionText}`;
  }

  if (result.verdict === VERDICTS.wait) {
    return `Produsul nu este respins, dar momentul nu pare ideal. ${positiveText} ${cautionText}`;
  }

  return `Momentan nu merită să cumperi. ${positiveText} ${cautionText}`;
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
  const impulseRisk = calculateImpulseRisk(data);
  const impulsePenalty = impulseRisk === 'Ridicat' ? 12 : impulseRisk === 'Mediu' ? 6 : 0;
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

  let verdict = VERDICTS.skip;
  if (finalScore >= 75) {
    verdict = VERDICTS.buy;
  } else if (finalScore >= 50) {
    verdict = VERDICTS.wait;
  }

  const result = {
    finalScore,
    verdict,
    impulseRisk,
    costVsIncomePercent,
    costVsSavingsPercent,
    hoursOfWork,
    goalImpactText: getGoalImpactText(data, data.price),
    goalPenalty,
  };

  result.explanation = generateExplanation(result, data);
  return result;
}

function getVerdictClass(verdict) {
  if (verdict === VERDICTS.buy) return 'is-buy';
  if (verdict === VERDICTS.wait) return 'is-wait';
  return 'is-skip';
}

function getWishlistStatusClass(status) {
  if (status === 'cumpărat') return 'is-bought';
  if (status === 'respins') return 'is-dismissed';
  return 'is-active';
}

function renderOverview() {
  const decisions = getDecisions();
  const accepted = decisions.filter((item) => item.verdict === VERDICTS.buy).length;
  const postponed = decisions.filter((item) => item.verdict === VERDICTS.wait).length;
  const rejected = decisions.filter((item) => item.verdict === VERDICTS.skip).length;
  const avoidedMoney = decisions
    .filter((item) => item.verdict !== VERDICTS.buy)
    .reduce((sum, item) => sum + toNumber(item.price), 0);

  elements.totalDecisionsCard.textContent = decisions.length;
  elements.acceptedCard.textContent = accepted;
  elements.postponedCard.textContent = postponed;
  elements.rejectedCard.textContent = rejected;
  elements.avoidedMoneyCard.textContent = formatCurrency(avoidedMoney);
  elements.heroMetricScore.textContent = decisions.length;
  elements.heroMetricSavings.textContent = formatCurrency(avoidedMoney);
}

function renderHistory() {
  const decisions = getDecisions();
  elements.historyList.innerHTML = '';

  if (!decisions.length) {
    elements.historyList.innerHTML = '<div class="empty-state">Încă nu există analize salvate.</div>';
    return;
  }

  decisions.slice(0, 5).forEach((decision) => {
    const fragment = elements.historyTemplate.content.cloneNode(true);
    const item = fragment.querySelector('.history-item');
    const title = fragment.querySelector('.item-title');
    const meta = fragment.querySelector('.item-meta');
    const description = fragment.querySelector('.item-description');
    const verdictPill = fragment.querySelector('.verdict-pill');
    const score = fragment.querySelector('.history-score');
    const risk = fragment.querySelector('.history-risk');

    title.textContent = decision.productName;
    meta.textContent = `${decision.category} · ${formatCurrency(decision.price)} · ${formatDate(decision.dateCreated)}`;
    description.textContent = decision.explanation;
    score.textContent = `${decision.finalScore}/100`;
    risk.textContent = decision.impulseRisk;
    verdictPill.textContent = decision.verdict;
    verdictPill.classList.add(getVerdictClass(decision.verdict));

    item.dataset.id = decision.id;
    elements.historyList.appendChild(fragment);
  });
}

function renderWishlist() {
  const wishlist = getWishlist();
  elements.wishlistList.innerHTML = '';

  if (!wishlist.length) {
    elements.wishlistList.innerHTML = '<div class="empty-state">Wishlist-ul este gol momentan.</div>';
    return;
  }

  wishlist.forEach((itemData) => {
    const fragment = elements.wishlistTemplate.content.cloneNode(true);
    const item = fragment.querySelector('.wishlist-item');
    const title = fragment.querySelector('.item-title');
    const meta = fragment.querySelector('.item-meta');
    const status = fragment.querySelector('.wishlist-status');
    const actions = fragment.querySelector('.item-card-actions');

    title.textContent = itemData.productName;
    meta.textContent = `${itemData.category} · ${formatCurrency(itemData.price)}`;
    status.textContent = itemData.status;
    status.classList.add(getWishlistStatusClass(itemData.status));
    item.dataset.id = itemData.id;

    if (itemData.status !== 'cumpărat') {
      const boughtButton = document.createElement('button');
      boughtButton.type = 'button';
      boughtButton.className = 'btn btn-secondary btn-small';
      boughtButton.dataset.action = 'bought';
      boughtButton.dataset.id = itemData.id;
      boughtButton.textContent = 'Marchează ca cumpărat';
      actions.appendChild(boughtButton);
    }

    if (itemData.status !== 'respins') {
      const dismissButton = document.createElement('button');
      dismissButton.type = 'button';
      dismissButton.className = 'btn btn-ghost btn-small';
      dismissButton.dataset.action = 'dismiss';
      dismissButton.dataset.id = itemData.id;
      dismissButton.textContent = 'Respinge';
      actions.appendChild(dismissButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-ghost btn-small';
    deleteButton.dataset.action = 'delete';
    deleteButton.dataset.id = itemData.id;
    deleteButton.textContent = 'Șterge';
    actions.appendChild(deleteButton);

    elements.wishlistList.appendChild(fragment);
  });
}

function renderInsights() {
  const decisions = getDecisions();
  const accepted = decisions.filter((item) => item.verdict === VERDICTS.buy).length;
  const postponed = decisions.filter((item) => item.verdict === VERDICTS.wait).length;
  const rejected = decisions.filter((item) => item.verdict === VERDICTS.skip).length;
  const avoidedMoney = decisions
    .filter((item) => item.verdict !== VERDICTS.buy)
    .reduce((sum, item) => sum + toNumber(item.price), 0);

  const rejectedCategories = decisions
    .filter((item) => item.verdict === VERDICTS.skip)
    .reduce((accumulator, item) => {
      const category = item.category || 'Necategorizat';
      accumulator[category] = (accumulator[category] || 0) + 1;
      return accumulator;
    }, {});

  const topRejectedCategory = Object.entries(rejectedCategories)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const total = decisions.length || 1;
  const buyPercent = Math.round((accepted / total) * 100);
  const waitPercent = Math.round((postponed / total) * 100);
  const skipPercent = Math.round((rejected / total) * 100);

  elements.insightTotal.textContent = decisions.length;
  elements.insightAccepted.textContent = accepted;
  elements.insightPostponed.textContent = postponed;
  elements.insightRejected.textContent = rejected;
  elements.insightAvoided.textContent = formatCurrency(avoidedMoney);
  elements.topRejectedCategory.textContent = topRejectedCategory;

  elements.buyBarValue.textContent = `${buyPercent}%`;
  elements.waitBarValue.textContent = `${waitPercent}%`;
  elements.skipBarValue.textContent = `${skipPercent}%`;

  elements.buyBarFill.style.width = `${buyPercent}%`;
  elements.waitBarFill.style.width = `${waitPercent}%`;
  elements.skipBarFill.style.width = `${skipPercent}%`;
}

function renderResult(result) {
  elements.resultEmptyState.classList.add('hidden');
  elements.resultContent.classList.remove('hidden');

  elements.finalScoreDisplay.textContent = result.finalScore;
  elements.verdictText.textContent = result.verdict;
  elements.verdictBox.className = `verdict-box ${getVerdictClass(result.verdict)}`;
  elements.explanationText.textContent = result.explanation;
  elements.costIncomeText.textContent = formatPercent(result.costVsIncomePercent);
  elements.costSavingsText.textContent = formatPercent(result.costVsSavingsPercent);
  elements.hoursWorkText.textContent = formatHours(result.hoursOfWork);
  elements.goalImpactText.textContent = result.goalImpactText;
  elements.impulseRiskBadge.textContent = result.impulseRisk;
  elements.impulseRiskBadge.className = 'risk-badge';

  if (result.impulseRisk === 'Ridicat') {
    elements.impulseRiskBadge.classList.add('risk-high');
    elements.impulseRiskDetail.textContent = 'Semnalele comportamentale arată că această decizie poate fi impulsivă.';
  } else if (result.impulseRisk === 'Mediu') {
    elements.impulseRiskBadge.classList.add('risk-medium');
    elements.impulseRiskDetail.textContent = 'Există câteva semnale de impuls. Merită o pauză scurtă înainte de a decide.';
  } else {
    elements.impulseRiskBadge.classList.add('risk-low');
    elements.impulseRiskDetail.textContent = 'Contextul indică un risc redus de cumpărare impulsivă.';
  }
}

function renderDashboard() {
  renderOverview();
  renderHistory();
  renderWishlist();
  renderInsights();
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

function fillProfileFields(profile) {
  PROFILE_FIELDS.forEach((field) => {
    const input = document.querySelector(`[name="${field}"]`);
    if (!input || profile[field] === undefined || profile[field] === null) return;
    input.value = profile[field];
  });
}

function saveProfileFromForm() {
  const profilePatch = PROFILE_FIELDS.reduce((accumulator, field) => {
    const input = document.querySelector(`[name="${field}"]`);
    accumulator[field] = input ? input.value : '';
    return accumulator;
  }, {});

  saveProfile(profilePatch);
}

function handleSubmit(event) {
  event.preventDefault();

  if (!elements.purchaseForm.reportValidity()) {
    return;
  }

  const data = readFormData();
  const result = evaluatePurchase(data);
  const decision = {
    id: createId(),
    productName: data.productName,
    price: data.price,
    category: data.category,
    finalScore: result.finalScore,
    verdict: result.verdict,
    explanation: result.explanation,
    impulseRisk: result.impulseRisk,
    dateCreated: new Date().toISOString(),
  };

  saveDecision(decision);
  saveProfileFromForm();

  appState.latestAnalysis = {
    ...data,
    ...result,
  };

  renderResult(result);
  renderDashboard();
  elements.resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleWishlistClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === 'bought') {
    updateWishlistStatus(id, 'cumpărat');
  }

  if (action === 'dismiss') {
    updateWishlistStatus(id, 'respins');
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
    productName: appState.latestAnalysis.productName,
    price: appState.latestAnalysis.price,
    category: appState.latestAnalysis.category,
    status: 'activ',
    createdAt: new Date().toISOString(),
  });

  renderWishlist();
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

function initEventListeners() {
  elements.purchaseForm.addEventListener('submit', handleSubmit);
  elements.resetFormBtn.addEventListener('click', () => resetForm(true));
  elements.wishlistList.addEventListener('click', handleWishlistClick);
  elements.addToWishlistBtn.addEventListener('click', handleAddToWishlist);
  elements.analyzeAnotherBtn.addEventListener('click', () => {
    resetForm(true);
    document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  elements.startAnalysisBtn.addEventListener('click', () => {
    document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function init() {
  initRangeOutputs();
  initProfilePersistence();
  initEventListeners();
  renderDashboard();
}

init();
