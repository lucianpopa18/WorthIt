const STORAGE_KEY = 'worthit_redesign_history';
const IMPULSE_MOODS = ['stressed', 'bored', 'excited'];

const CATEGORY_DATA = {
  electronics: { boost: 0, insight: 'Tech purchases can be valuable, but they are also classic impulse-buy territory. Make sure it solves a real problem.' },
  health: { boost: 5, insight: 'Health purchases tend to have strong long-term upside when they support consistency and wellbeing.' },
  education: { boost: 4, insight: 'Learning compounds. Education is one of the few categories that often keeps paying you back.' },
  home: { boost: 2, insight: 'Home improvements can improve quality of life every day, which makes them easier to justify.' },
  transport: { boost: 1, insight: 'Transport-related costs are functional, but total ownership cost matters more than the sticker price.' },
  utilities: { boost: 2, insight: 'Services and utilities are usually need-driven, so the impulse risk tends to be lower.' },
  food: { boost: 1, insight: 'Food is recurring by nature. The real question is whether this is routine spending or a mood-driven one-off.' },
  groceries: { boost: 3, insight: 'Even everyday items add up over time. Mindful grocery spending still creates a meaningful long-term effect.' },
  clothing: { boost: -3, insight: 'Clothing is one of the easiest categories to rationalize emotionally. Slow down and pressure-test the need.' },
  entertainment: { boost: -4, insight: 'Entertainment can be worth it, but it is usually short-lived. Budget-fit matters a lot here.' },
  travel: { boost: -3, insight: 'Experiences are real value, but timing matters. Travel tends to feel best when finances are stable.' },
  other: { boost: 0, insight: 'General purchases benefit most from clear reasoning, realistic use, and honest affordability.' },
};

const form = document.getElementById('worthitForm');
const resultCard = document.getElementById('resultCard');
const scoreValue = document.getElementById('scoreValue');
const scoreRing = document.getElementById('scoreRing');
const verdictPill = document.getElementById('verdictPill');
const resultHeadline = document.getElementById('resultHeadline');
const resultText = document.getElementById('resultText');
const incomeImpact = document.getElementById('incomeImpact');
const savingsImpact = document.getElementById('savingsImpact');
const hoursImpact = document.getElementById('hoursImpact');
const impulseRisk = document.getElementById('impulseRisk');
const goalImpactTag = document.getElementById('goalImpactTag');
const explanationText = document.getElementById('explanationText');
const saveAnalysisBtn = document.getElementById('saveAnalysisBtn');

const sliderIds = ['necessityScore', 'urgencyScore', 'frequencyScore', 'longTermValueScore'];
sliderIds.forEach((id) => {
  const input = document.getElementById(id);
  const output = document.getElementById(id.replace('Score', 'Value'));
  if (!input || !output) return;
  const sync = () => {
    output.textContent = input.value;
  };
  input.addEventListener('input', sync);
  sync();
});

function safeNum(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(safeNum(value));
}

function formatPercent(value) {
  return `${safeNum(value).toFixed(1)}%`;
}

function formatHours(value) {
  return `${safeNum(value).toFixed(1)}h`;
}

function calculateImpulseRisk(data) {
  let points = 0;
  if (data.daysWanted <= 2) points += 2;
  if (data.necessityScore <= 5) points += 1;
  if (data.urgencyScore <= 4) points += 1;
  if (data.hasAlternative) points += 1;
  if (IMPULSE_MOODS.includes(data.mood)) points += 2;

  if (points >= 5) return 'High';
  if (points >= 3) return 'Medium';
  return 'Low';
}

function getCategoryInsight(category) {
  return CATEGORY_DATA[category]?.insight || CATEGORY_DATA.other.insight;
}

function getCategoryBoost(category) {
  return CATEGORY_DATA[category]?.boost || 0;
}

function evaluate(data) {
  const costVsIncomePercent = data.monthlyIncome > 0 ? (data.price / data.monthlyIncome) * 100 : 100;
  const costVsSavingsPercent = data.savings > 0 ? (data.price / data.savings) * 100 : 100;
  const hoursOfWork = data.hourlyIncome > 0 ? data.price / data.hourlyIncome : data.price;
  const impulse = calculateImpulseRisk(data);

  const necessityPoints = clamp((data.necessityScore / 10) * 24, 0, 24);
  const frequencyPoints = clamp((data.frequencyScore / 10) * 16, 0, 16);
  const longTermPoints = clamp((data.longTermValueScore / 10) * 20, 0, 20);
  const urgencyDistance = Math.abs(data.urgencyScore - 6);
  const urgencyPoints = clamp(12 - urgencyDistance * 2, 0, 12);

  const incomePenalty = clamp(costVsIncomePercent * 0.55, 0, 18);
  const savingsPenalty = clamp(costVsSavingsPercent * 0.25, 0, 15);
  const budgetPenalty = data.monthlyBudget > 0
    ? clamp(((data.price - data.monthlyBudget) / Math.max(data.monthlyBudget, 1)) * 25, 0, 12)
    : 6;
  const altPenalty = data.hasAlternative ? 8 : 0;
  const daysPenalty = data.daysWanted <= 2 ? 10 : data.daysWanted <= 7 ? 4 : 0;
  const moodPenalty = IMPULSE_MOODS.includes(data.mood) ? 7 : data.mood === 'sad' ? 4 : 0;
  const categoryBoost = getCategoryBoost(data.category);

  const base = necessityPoints + frequencyPoints + longTermPoints + urgencyPoints;
  const penalties = incomePenalty + savingsPenalty + budgetPenalty + altPenalty + daysPenalty + moodPenalty;
  const finalScore = Math.round(clamp(base - penalties + 28 + categoryBoost, 0, 100));

  const verdict = finalScore >= 75 ? 'Buy' : finalScore >= 50 ? 'Wait' : 'Skip';
  const verdictClass = verdict.toLowerCase();

  const positives = [];
  const cautions = [];

  if (data.necessityScore >= 7) positives.push('the need looks real');
  if (data.frequencyScore >= 7) positives.push('you will likely use it often');
  if (data.longTermValueScore >= 7) positives.push('it has strong long-term value');
  if (data.daysWanted >= 7) positives.push('it does not look like a pure impulse');
  if (costVsIncomePercent <= 10) positives.push('it is affordable relative to income');
  if ((data.reason || '').trim().length >= 18) positives.push('you gave a clear reason for buying it');

  if (costVsIncomePercent >= 30) cautions.push('it takes a large share of monthly income');
  if (costVsSavingsPercent >= 20) cautions.push('it hits savings pretty hard');
  if (data.hasAlternative) cautions.push('you already own a reasonable alternative');
  if (impulse === 'High') cautions.push('the context suggests a high impulse risk');
  if (data.daysWanted <= 2) cautions.push('you have wanted it only briefly');
  if (data.monthlyBudget > 0 && data.price > data.monthlyBudget) cautions.push('it is above your current budget window');

  let explanation = '';
  if (verdict === 'Buy') {
    explanation = 'This looks like a strong purchase. ';
  } else if (verdict === 'Wait') {
    explanation = 'This is not a hard no, but the timing could be better. ';
  } else {
    explanation = 'This is probably not worth buying right now. ';
  }

  explanation += positives.length
    ? `Best signals: ${positives.slice(0, 3).join(', ')}. `
    : 'There are not many strong signals supporting the purchase yet. ';

  explanation += cautions.length
    ? `Main cautions: ${cautions.slice(0, 3).join(', ')}.`
    : 'There are no major warning signals in the current context.';

  return {
    finalScore,
    verdict,
    verdictClass,
    costVsIncomePercent,
    costVsSavingsPercent,
    hoursOfWork,
    impulse,
    explanation,
    categoryInsight: getCategoryInsight(data.category),
  };
}

function getFormData() {
  return {
    productName: form.productName.value.trim(),
    price: safeNum(form.price.value),
    category: form.category.value,
    reason: form.reason.value.trim(),
    monthlyIncome: safeNum(form.monthlyIncome.value),
    monthlyBudget: safeNum(form.monthlyBudget.value),
    savings: safeNum(form.savings.value),
    hourlyIncome: safeNum(form.hourlyIncome.value),
    daysWanted: safeNum(form.daysWanted.value),
    mood: form.mood.value,
    hasAlternative: form.hasAlternative.checked,
    necessityScore: safeNum(form.necessityScore.value),
    urgencyScore: safeNum(form.urgencyScore.value),
    frequencyScore: safeNum(form.frequencyScore.value),
    longTermValueScore: safeNum(form.longTermValueScore.value),
  };
}

let lastAnalysis = null;
let scoreAnimationFrame = null;

function animateScore(target) {
  cancelAnimationFrame(scoreAnimationFrame);
  const current = safeNum(scoreValue.textContent);
  const start = performance.now();
  const duration = 520;

  function tick(now) {
    const progress = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const next = Math.round(current + (target - current) * eased);
    scoreValue.textContent = String(next);
    if (progress < 1) {
      scoreAnimationFrame = requestAnimationFrame(tick);
    }
  }

  scoreAnimationFrame = requestAnimationFrame(tick);
}

function renderResult(data, result) {
  animateScore(result.finalScore);
  scoreRing.style.setProperty('--score', result.finalScore);

  let ringColor = '#64748b';
  if (result.verdictClass === 'buy') ringColor = '#22c55e';
  if (result.verdictClass === 'wait') ringColor = '#f59e0b';
  if (result.verdictClass === 'skip') ringColor = '#ef4444';
  scoreRing.style.setProperty('--ring-color', ringColor);

  verdictPill.className = `verdict-pill verdict-pill-${result.verdictClass}`;
  verdictPill.textContent = result.verdict;
  resultHeadline.textContent = `${data.productName || 'This purchase'} scores ${result.finalScore}/100`;
  resultText.textContent = result.categoryInsight;
  incomeImpact.textContent = formatPercent(result.costVsIncomePercent);
  savingsImpact.textContent = formatPercent(result.costVsSavingsPercent);
  hoursImpact.textContent = formatHours(result.hoursOfWork);
  impulseRisk.textContent = result.impulse;
  goalImpactTag.textContent = result.verdict === 'Buy' ? 'Green light' : result.verdict === 'Wait' ? 'Cooling-off recommended' : 'Hold off';
  explanationText.textContent = result.explanation;

  resultCard.classList.add('is-updated');
  window.setTimeout(() => resultCard.classList.remove('is-updated'), 280);

  lastAnalysis = {
    productName: data.productName,
    price: data.price,
    verdict: result.verdict,
    finalScore: result.finalScore,
    savedAt: new Date().toISOString(),
  };
}

function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 100)));
}

function refreshHeroStats() {
  const history = getHistory();
  const total = history.length;
  const buy = history.filter((item) => item.verdict === 'Buy').length;
  const skippedValue = history
    .filter((item) => item.verdict === 'Skip')
    .reduce((sum, item) => sum + safeNum(item.price), 0);

  document.getElementById('heroAnalyses').textContent = String(total);
  document.getElementById('heroAvoided').textContent = formatCurrency(skippedValue);
  document.getElementById('heroBuyRate').textContent = total ? `${Math.round((buy / total) * 100)}%` : '—';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = getFormData();
  const result = evaluate(data);
  renderResult(data, result);
});

form.addEventListener('reset', () => {
  window.setTimeout(() => {
    sliderIds.forEach((id) => {
      const input = document.getElementById(id);
      const output = document.getElementById(id.replace('Score', 'Value'));
      if (input && output) output.textContent = input.value;
    });

    scoreValue.textContent = '0';
    scoreRing.style.setProperty('--score', 0);
    scoreRing.style.setProperty('--ring-color', '#334155');
    verdictPill.className = 'verdict-pill verdict-pill-neutral';
    verdictPill.textContent = 'Awaiting input';
    resultHeadline.textContent = 'Waiting for your first analysis';
    resultText.textContent = 'Fill in the product and financial context to get a clear verdict, impact summary, and recommendation.';
    incomeImpact.textContent = '—';
    savingsImpact.textContent = '—';
    hoursImpact.textContent = '—';
    impulseRisk.textContent = '—';
    goalImpactTag.textContent = 'No goal set';
    explanationText.textContent = 'WorthIt weighs product need, frequency, urgency, affordability, mood context, and opportunity cost.';
    lastAnalysis = null;
  }, 0);
});

saveAnalysisBtn.addEventListener('click', () => {
  if (!lastAnalysis) return;
  const history = getHistory();
  history.unshift(lastAnalysis);
  setHistory(history);
  refreshHeroStats();
  saveAnalysisBtn.textContent = 'Saved';
  saveAnalysisBtn.disabled = true;
  window.setTimeout(() => {
    saveAnalysisBtn.textContent = 'Save analysis';
    saveAnalysisBtn.disabled = false;
  }, 1200);
});

refreshHeroStats();
