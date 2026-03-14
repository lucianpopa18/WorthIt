const STORAGE_KEYS = {
  decisions: 'worthit_decisions',
  wishlist: 'worthit_wishlist',
  profile: 'worthit_profile',
};

const VERDICTS = {
  buy: 'Buy',
  wait: 'Wait',
  skip: 'Do not buy now',
};

const IMPULSE_RISK = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const IMPULSE_MOODS = ['stressed', 'bored', 'excited'];

const form = document.getElementById('purchaseForm');
const resetFormBtn = document.getElementById('resetFormBtn');
const resultEmptyState = document.getElementById('resultEmptyState');
const resultContent = document.getElementById('resultContent');
const wishlistBtn = document.getElementById('wishlistBtn');
const analyzeAnotherBtn = document.getElementById('analyzeAnotherBtn');
const resetDataBtn = document.getElementById('resetDataBtn');

let lastAnalysis = null;

function formatCurrency(value) {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function formatHours(value) {
  return `${Number(value || 0).toFixed(1)}h`;
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function slugifyVerdict(verdict) {
  if (verdict === VERDICTS.buy) return 'buy';
  if (verdict === VERDICTS.wait) return 'wait';
  return 'skip';
}

function getStorageArray(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStorageArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.profile);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

function getDecisions() {
  return getStorageArray(STORAGE_KEYS.decisions);
}

function saveDecision(decision) {
  const decisions = getDecisions();
  decisions.unshift(decision);
  setStorageArray(STORAGE_KEYS.decisions, decisions.slice(0, 100));
}

function getWishlist() {
  return getStorageArray(STORAGE_KEYS.wishlist);
}

function saveWishlist(item) {
  const wishlist = getWishlist();
  wishlist.unshift(item);
  setStorageArray(STORAGE_KEYS.wishlist, wishlist.slice(0, 100));
}

function updateWishlistItem(id, updates) {
  const wishlist = getWishlist().map((item) => (item.id === id ? { ...item, ...updates } : item));
  setStorageArray(STORAGE_KEYS.wishlist, wishlist);
}

function deleteWishlistItem(id) {
  const wishlist = getWishlist().filter((item) => item.id !== id);
  setStorageArray(STORAGE_KEYS.wishlist, wishlist);
}

function populateProfileFields() {
  const profile = getProfile();
  ['monthlyIncome', 'monthlyBudget', 'savings', 'hourlyIncome', 'mainGoalName', 'mainGoalTarget', 'mainGoalCurrent'].forEach((key) => {
    const field = document.getElementById(key);
    if (!field) return;
    if (profile[key] !== undefined && profile[key] !== null && profile[key] !== '') {
      field.value = profile[key];
    }
  });
}

function persistProfileFromForm(data) {
  saveProfile({
    monthlyIncome: data.monthlyIncome,
    monthlyBudget: data.monthlyBudget,
    savings: data.savings,
    hourlyIncome: data.hourlyIncome,
    mainGoalName: data.mainGoalName,
    mainGoalTarget: data.mainGoalTarget,
    mainGoalCurrent: data.mainGoalCurrent,
  });
}

function getFormData() {
  return {
    productName: form.productName.value.trim(),
    price: safeNumber(form.price.value),
    category: form.category.value.trim() || 'Other',
    reason: form.reason.value.trim(),
    necessityScore: safeNumber(form.necessityScore.value),
    urgencyScore: safeNumber(form.urgencyScore.value),
    frequencyScore: safeNumber(form.frequencyScore.value),
    longTermValueScore: safeNumber(form.longTermValueScore.value),
    hasAlternative: form.hasAlternative.checked,
    daysWanted: safeNumber(form.daysWanted.value),
    mood: form.mood.value,
    monthlyIncome: safeNumber(form.monthlyIncome.value),
    monthlyBudget: safeNumber(form.monthlyBudget.value),
    savings: safeNumber(form.savings.value),
    hourlyIncome: safeNumber(form.hourlyIncome.value),
    mainGoalName: form.mainGoalName.value.trim(),
    mainGoalTarget: safeNumber(form.mainGoalTarget.value),
    mainGoalCurrent: safeNumber(form.mainGoalCurrent.value),
  };
}

function calculateImpulseRisk(data) {
  let points = 0;

  if (data.daysWanted <= 2) points += 2;
  if (data.necessityScore <= 5) points += 1;
  if (data.urgencyScore <= 4) points += 1;
  if (data.hasAlternative) points += 1;
  if (IMPULSE_MOODS.includes(data.mood)) points += 2;

  if (points >= 5) return IMPULSE_RISK.high;
  if (points >= 3) return IMPULSE_RISK.medium;
  return IMPULSE_RISK.low;
}

function getGoalImpactText(data) {
  const goalName = data.mainGoalName;
  const target = data.mainGoalTarget;
  const current = data.mainGoalCurrent;

  if (!goalName || target <= 0) {
    return 'No goal set.';
  }

  const remaining = Math.max(target - current, 0);

  if (remaining <= 0) {
    return `Your “${goalName}” goal is already fully funded.`;
  }

  if (data.price >= remaining) {
    return `This purchase would consume the entire remaining amount for “${goalName}”.`;
  }

  const percent = clamp((data.price / remaining) * 100, 0, 100);
  return `This purchase would consume ${percent.toFixed(1)}% of the remaining amount for “${goalName}”.`;
}

function generateExplanation(result, data) {
  const positives = [];
  const cautions = [];

  if (data.necessityScore >= 7) positives.push('pare o nevoie reală');
  if (data.frequencyScore >= 7) positives.push('sunt șanse mari să îl folosești des');
  if (data.longTermValueScore >= 7) positives.push('oferă valoare bună pe termen lung');
  if (data.daysWanted >= 7) positives.push('îl vrei de suficient timp încât să nu pară doar un impuls de moment');
  if (result.costVsIncomePercent <= 10) positives.push('costul este ușor de dus raportat la venitul tău lunar');
  if (data.reason.length >= 18) positives.push('ai un motiv destul de clar pentru această achiziție');

  if (result.costVsIncomePercent >= 30) cautions.push('ia o parte mare din venitul lunar');
  if (result.costVsSavingsPercent >= 20) cautions.push('taie serios din economii');
  if (data.hasAlternative) cautions.push('ai deja o alternativă rezonabilă');
  if (result.impulseRisk === IMPULSE_RISK.high) cautions.push('contextul arată un risc mare de cumpărare impulsivă');
  if (data.mainGoalName && /consume|remaining/i.test(result.goalImpactText)) cautions.push('îți încetinește obiectivul financiar');
  if (data.daysWanted <= 2) cautions.push('îl vrei de foarte puțin timp');
  if (data.monthlyBudget > 0 && data.price > data.monthlyBudget) cautions.push('depășește bugetul lunar disponibil');

  const positiveSentence = positives.length
    ? `Argumente pro: ${positives.join(', ')}.`
    : 'Nu există destule semnale puternice care să susțină clar achiziția.';

  const cautionSentence = cautions.length
    ? `Motive de prudență: ${cautions.join(', ')}.`
    : 'Nu apar semnale majore de avertizare în contextul actual.';

  if (result.verdict === VERDICTS.buy) {
    return `Verdictul este favorabil. ${positiveSentence} ${cautionSentence}`;
  }

  if (result.verdict === VERDICTS.wait) {
    return `Produsul nu este un refuz clar, dar momentul nu este ideal încă. ${positiveSentence} ${cautionSentence}`;
  }

  return `Momentan este mai bine să nu cumperi. ${positiveSentence} ${cautionSentence}`;
}

function evaluatePurchase(data) {
  const costVsIncomePercent = data.monthlyIncome > 0 ? (data.price / data.monthlyIncome) * 100 : 100;
  const costVsSavingsPercent = data.savings > 0 ? (data.price / data.savings) * 100 : 100;
  const hoursOfWork = data.hourlyIncome > 0 ? data.price / data.hourlyIncome : data.price;
  const impulseRisk = calculateImpulseRisk(data);
  const goalImpactText = getGoalImpactText(data);

  const necessityPoints = clamp((data.necessityScore / 10) * 24, 0, 24);
  const frequencyPoints = clamp((data.frequencyScore / 10) * 16, 0, 16);
  const longTermValuePoints = clamp((data.longTermValueScore / 10) * 20, 0, 20);
  const urgencyDistance = Math.abs(data.urgencyScore - 6);
  const urgencyPoints = clamp(12 - urgencyDistance * 2, 0, 12);

  const incomePenalty = clamp(costVsIncomePercent * 0.55, 0, 18);
  const savingsPenalty = clamp(costVsSavingsPercent * 0.25, 0, 15);
  const budgetPenalty = data.monthlyBudget > 0 ? clamp(((data.price - data.monthlyBudget) / data.monthlyBudget) * 25, 0, 12) : 8;
  const alternativePenalty = data.hasAlternative ? 8 : 0;
  const daysPenalty = data.daysWanted <= 2 ? 10 : data.daysWanted <= 7 ? 4 : 0;
  const moodPenalty = IMPULSE_MOODS.includes(data.mood) ? 7 : data.mood === 'sad' ? 4 : 0;

  let goalPenalty = 0;
  if (data.mainGoalName && data.mainGoalTarget > 0) {
    const remaining = Math.max(data.mainGoalTarget - data.mainGoalCurrent, 0);
    if (remaining > 0) {
      goalPenalty = clamp((data.price / remaining) * 18, 0, 18);
    }
  }

  const baseScore = necessityPoints + frequencyPoints + longTermValuePoints + urgencyPoints;
  const penalties = incomePenalty + savingsPenalty + budgetPenalty + alternativePenalty + daysPenalty + moodPenalty + goalPenalty;
  const finalScore = Math.round(clamp(baseScore - penalties + 28, 0, 100));

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
    goalImpactText,
  };

  result.explanation = generateExplanation(result, data);
  return result;
}

function getVerdictClass(verdict) {
  return slugifyVerdict(verdict);
}

function getRiskTone(risk) {
  if (risk === IMPULSE_RISK.high) return 'danger';
  if (risk === IMPULSE_RISK.medium) return 'warning';
  return 'positive';
}

function updateScoreRing(score, verdictClass) {
  const ring = document.getElementById('scoreRing');
  const colorMap = {
    buy: 'var(--positive)',
    wait: 'var(--warning)',
    skip: 'var(--danger)',
  };
  ring.style.setProperty('--ring-angle', `${(score / 100) * 360}deg`);
  ring.style.setProperty('--ring-color', colorMap[verdictClass]);
}

function renderResult(result, data) {
  resultEmptyState.classList.add('hidden');
  resultContent.classList.remove('hidden');

  const verdictClass = getVerdictClass(result.verdict);
  const riskTone = getRiskTone(result.impulseRisk);

  document.getElementById('finalScoreValue').textContent = result.finalScore;
  document.getElementById('verdictText').textContent = result.verdict;
  document.getElementById('verdictPill').textContent = result.verdict;
  document.getElementById('verdictPill').className = `verdict-pill ${verdictClass}`;
  document.getElementById('explanationText').textContent = result.explanation;
  document.getElementById('incomePercentValue').textContent = formatPercent(result.costVsIncomePercent);
  document.getElementById('savingsPercentValue').textContent = formatPercent(result.costVsSavingsPercent);
  document.getElementById('hoursOfWorkValue').textContent = formatHours(result.hoursOfWork);
  document.getElementById('impulseRiskValue').textContent = result.impulseRisk;
  document.getElementById('impulseRiskValue').style.color = `var(--${riskTone})`;
  document.getElementById('goalImpactValue').textContent = result.goalImpactText;

  updateScoreRing(result.finalScore, verdictClass);

  lastAnalysis = {
    id: crypto.randomUUID(),
    productName: data.productName,
    price: data.price,
    category: data.category,
    finalScore: result.finalScore,
    verdict: result.verdict,
    explanation: result.explanation,
    impulseRisk: result.impulseRisk,
    dateCreated: new Date().toISOString(),
  };
}

function renderDashboard() {
  const decisions = getDecisions();
  const total = decisions.length;
  const accepted = decisions.filter((item) => item.verdict === VERDICTS.buy).length;
  const postponed = decisions.filter((item) => item.verdict === VERDICTS.wait).length;
  const rejected = decisions.filter((item) => item.verdict === VERDICTS.skip).length;
  const avoidedMoney = decisions
    .filter((item) => item.verdict !== VERDICTS.buy)
    .reduce((sum, item) => sum + safeNumber(item.price), 0);

  document.getElementById('heroDecisions').textContent = total;
  document.getElementById('heroAvoided').textContent = formatCurrency(avoidedMoney);
  document.getElementById('totalDecisionsCard').textContent = total;
  document.getElementById('acceptedCard').textContent = accepted;
  document.getElementById('postponedCard').textContent = postponed;
  document.getElementById('rejectedCard').textContent = rejected;
  document.getElementById('avoidedMoneyCard').textContent = formatCurrency(avoidedMoney);
}

function renderHistory() {
  const historyList = document.getElementById('historyList');
  const decisions = getDecisions().slice(0, 6);
  historyList.innerHTML = '';

  if (!decisions.length) {
    historyList.innerHTML = '<div class="empty-state">There are no saved decisions yet.</div>';
    return;
  }

  const template = document.getElementById('historyItemTemplate');

  decisions.forEach((item) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.list-title').textContent = item.productName;
    node.querySelector('.list-meta').textContent = `${formatCurrency(item.price)} · ${item.category || 'Other'} · ${formatDate(item.dateCreated)}`;
    node.querySelector('.list-copy').textContent = item.explanation || 'No explanation available for this saved analysis.';
    const badge = node.querySelector('.verdict-badge');
    badge.textContent = `${item.verdict} · ${item.finalScore}`;
    badge.classList.add(getVerdictClass(item.verdict));
    historyList.appendChild(node);
  });
}

function renderWishlist() {
  const wishlistList = document.getElementById('wishlistList');
  const items = getWishlist();
  wishlistList.innerHTML = '';

  if (!items.length) {
    wishlistList.innerHTML = '<div class="empty-state">The wishlist is empty for now.</div>';
    return;
  }

  const template = document.getElementById('wishlistItemTemplate');

  items.forEach((item) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.list-title').textContent = item.productName;
    node.querySelector('.list-meta').textContent = `${formatCurrency(item.price)} · ${item.category || 'Other'}`;
    const badge = node.querySelector('.status-badge');
    badge.textContent = item.status;
    badge.classList.add(item.status.toLowerCase());

    node.querySelectorAll('[data-action]').forEach((button) => {
      button.dataset.id = item.id;
    });

    wishlistList.appendChild(node);
  });
}

function renderInsights() {
  const decisions = getDecisions();
  const total = decisions.length;
  const accepted = decisions.filter((item) => item.verdict === VERDICTS.buy).length;
  const postponed = decisions.filter((item) => item.verdict === VERDICTS.wait).length;
  const rejected = decisions.filter((item) => item.verdict === VERDICTS.skip).length;
  const avoidedMoney = decisions
    .filter((item) => item.verdict !== VERDICTS.buy)
    .reduce((sum, item) => sum + safeNumber(item.price), 0);

  const rejectedByCategory = decisions
    .filter((item) => item.verdict === VERDICTS.skip)
    .reduce((acc, item) => {
      const key = item.category || 'Other';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const topRejectedCategory = Object.entries(rejectedByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  document.getElementById('insightTotal').textContent = total;
  document.getElementById('insightAccepted').textContent = accepted;
  document.getElementById('insightPostponed').textContent = postponed;
  document.getElementById('insightRejected').textContent = rejected;
  document.getElementById('insightAvoided').textContent = formatCurrency(avoidedMoney);
  document.getElementById('topRejectedCategory').textContent = topRejectedCategory;

  const buyPercent = total ? (accepted / total) * 100 : 0;
  const waitPercent = total ? (postponed / total) * 100 : 0;
  const skipPercent = total ? (rejected / total) * 100 : 0;

  document.getElementById('buyBarValue').textContent = `${Math.round(buyPercent)}%`;
  document.getElementById('waitBarValue').textContent = `${Math.round(waitPercent)}%`;
  document.getElementById('skipBarValue').textContent = `${Math.round(skipPercent)}%`;
  document.getElementById('buyBarFill').style.width = `${buyPercent}%`;
  document.getElementById('waitBarFill').style.width = `${waitPercent}%`;
  document.getElementById('skipBarFill').style.width = `${skipPercent}%`;
}

function refreshUI() {
  renderDashboard();
  renderHistory();
  renderWishlist();
  renderInsights();
}

function clearAllSavedData() {
  localStorage.removeItem(STORAGE_KEYS.decisions);
  localStorage.removeItem(STORAGE_KEYS.wishlist);
  localStorage.removeItem(STORAGE_KEYS.profile);
  lastAnalysis = null;
  resetForm(false);
  resultContent.classList.add('hidden');
  resultEmptyState.classList.remove('hidden');
  wishlistBtn.textContent = 'Add to wishlist';
  refreshUI();
}

function updateRangeOutputs() {
  document.querySelectorAll('[data-range-output]').forEach((output) => {
    const input = document.getElementById(output.dataset.rangeOutput);
    if (!input) return;
    output.textContent = input.value;
  });
}

function saveCurrentAnalysis() {
  if (!lastAnalysis) return;
  saveDecision(lastAnalysis);
  refreshUI();
}

function addCurrentAnalysisToWishlist() {
  if (!lastAnalysis) return;
  saveWishlist({
    id: crypto.randomUUID(),
    productName: lastAnalysis.productName,
    price: lastAnalysis.price,
    category: lastAnalysis.category,
    status: 'active',
    dateCreated: new Date().toISOString(),
  });
  renderWishlist();
}

function resetForm(keepProfile = true) {
  const profile = keepProfile ? getProfile() : {};
  form.reset();
  form.necessityScore.value = 5;
  form.urgencyScore.value = 5;
  form.frequencyScore.value = 5;
  form.longTermValueScore.value = 5;
  form.daysWanted.value = 3;
  form.mood.value = 'neutral';

  if (keepProfile) {
    ['monthlyIncome', 'monthlyBudget', 'savings', 'hourlyIncome', 'mainGoalName', 'mainGoalTarget', 'mainGoalCurrent'].forEach((key) => {
      if (profile[key] !== undefined && profile[key] !== null && profile[key] !== '') {
        form[key].value = profile[key];
      }
    });
  }

  updateRangeOutputs();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  const data = getFormData();
  const result = evaluatePurchase(data);

  persistProfileFromForm(data);
  renderResult(result, data);
  saveCurrentAnalysis();
});

resetFormBtn.addEventListener('click', () => {
  resetForm(true);
  form.productName.focus();
});

wishlistBtn.addEventListener('click', () => {
  if (!lastAnalysis) return;
  addCurrentAnalysisToWishlist();
  wishlistBtn.textContent = 'Added to wishlist';
  setTimeout(() => {
    wishlistBtn.textContent = 'Add to wishlist';
  }, 1200);
});

analyzeAnotherBtn.addEventListener('click', () => {
  resetForm(true);
  form.productName.focus();
  window.scrollTo({ top: document.getElementById('analyzer').offsetTop - 10, behavior: 'smooth' });
});

document.querySelectorAll('input[type="range"]').forEach((input) => {
  input.addEventListener('input', updateRangeOutputs);
});

document.getElementById('wishlistList').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === 'bought') {
    updateWishlistItem(id, { status: 'bought' });
  }

  if (action === 'dismiss') {
    updateWishlistItem(id, { status: 'dismissed' });
  }

  if (action === 'delete') {
    deleteWishlistItem(id);
  }

  renderWishlist();
});

resetDataBtn.addEventListener('click', () => {
  const confirmed = window.confirm('This will permanently delete your saved decisions, wishlist and profile values. Continue?');
  if (!confirmed) return;
  clearAllSavedData();
});

function initApp() {
  populateProfileFields();
  resetForm(true);
  refreshUI();
}

initApp();
