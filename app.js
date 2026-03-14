const STORAGE_KEY = 'worthit-v2-history';

const CATEGORY_COPY = {
  tech: {
    bonus: 2,
    driver: 'Long-term utility potential',
    caution: 'Tech can get replaced faster than expected.',
  },
  subscription: {
    bonus: -2,
    driver: 'Low upfront barrier',
    caution: 'Subscriptions quietly compound over time.',
  },
  fitness: {
    bonus: 3,
    driver: 'Consistent use can create outsized value.',
    caution: 'Motivation risk is the main trap here.',
  },
  home: {
    bonus: 1,
    driver: 'Practical daily convenience',
    caution: 'Easy to overestimate how much it will improve life.',
  },
  other: {
    bonus: 0,
    driver: 'Value depends heavily on honest usage assumptions.',
    caution: 'This only works if your inputs stay realistic.',
  },
};

const SCENARIO_MODIFIERS = {
  conservative: { usage: 0.72, value: -0.9, duration: 0.82 },
  realistic: { usage: 1, value: 0, duration: 1 },
  optimistic: { usage: 1.18, value: 0.8, duration: 1.08 },
};

const form = document.getElementById('worthitForm');
const resultCard = document.getElementById('resultCard');
const saveAnalysisBtn = document.getElementById('saveAnalysisBtn');

const sliderIds = ['necessity', 'personalValue', 'urgency'];
const sliderMap = Object.fromEntries(sliderIds.map((id) => [id, document.getElementById(id)]));

const ui = {
  heroAnalyses: document.getElementById('heroAnalyses'),
  heroSaved: document.getElementById('heroSaved'),
  quickLifetimeCost: document.getElementById('quickLifetimeCost'),
  quickCostPerUse: document.getElementById('quickCostPerUse'),
  quickUsageHorizon: document.getElementById('quickUsageHorizon'),
  scoreValue: document.getElementById('scoreValue'),
  scoreRing: document.getElementById('scoreRing'),
  verdictPill: document.getElementById('verdictPill'),
  resultTitle: document.getElementById('resultTitle'),
  resultSummary: document.getElementById('resultSummary'),
  scenarioConservative: document.getElementById('scenarioConservative'),
  scenarioRealistic: document.getElementById('scenarioRealistic'),
  scenarioOptimistic: document.getElementById('scenarioOptimistic'),
  costPerUseStat: document.getElementById('costPerUseStat'),
  incomeImpactStat: document.getElementById('incomeImpactStat'),
  hoursStat: document.getElementById('hoursStat'),
  confidenceStat: document.getElementById('confidenceStat'),
  impactChip: document.getElementById('impactChip'),
  insightText: document.getElementById('insightText'),
  driverText: document.getElementById('driverText'),
  cautionText: document.getElementById('cautionText'),
  savedCount: document.getElementById('savedCount'),
};

let lastAnalysis = null;
let animationFrame = null;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function safeNum(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function eur(value) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(Math.max(0, value));
}

function percent(value) {
  return `${safeNum(value).toFixed(1)}%`;
}

function hours(value) {
  return `${safeNum(value).toFixed(1)}h`;
}

function readForm() {
  const data = new FormData(form);
  return {
    itemName: String(data.get('itemName') || '').trim(),
    category: String(data.get('category') || 'other'),
    price: safeNum(data.get('price')),
    monthlyIncome: safeNum(data.get('monthlyIncome')),
    usesPerMonth: Math.max(1, safeNum(data.get('usesPerMonth'), 1)),
    monthsKept: Math.max(1, safeNum(data.get('monthsKept'), 1)),
    recurringCost: safeNum(data.get('recurringCost')),
    savings: safeNum(data.get('savings')),
    necessity: safeNum(data.get('necessity'), 5),
    personalValue: safeNum(data.get('personalValue'), 5),
    urgency: safeNum(data.get('urgency'), 5),
    ownsAlternative: Boolean(data.get('ownsAlternative')),
    scenario: String(data.get('scenario') || 'realistic'),
  };
}

function getDerivedValues(baseData, scenarioName) {
  const scenario = SCENARIO_MODIFIERS[scenarioName] || SCENARIO_MODIFIERS.realistic;
  const category = CATEGORY_COPY[baseData.category] || CATEGORY_COPY.other;

  const adjustedUsesPerMonth = Math.max(1, baseData.usesPerMonth * scenario.usage);
  const adjustedMonths = Math.max(1, baseData.monthsKept * scenario.duration);
  const usageHorizon = adjustedUsesPerMonth * adjustedMonths;
  const lifetimeCost = baseData.price + baseData.recurringCost * adjustedMonths;
  const costPerUse = lifetimeCost / Math.max(usageHorizon, 1);
  const incomeImpact = baseData.monthlyIncome > 0 ? (baseData.price / baseData.monthlyIncome) * 100 : 100;
  const savingsImpact = baseData.savings > 0 ? (baseData.price / baseData.savings) * 100 : 100;
  const hourlyRate = baseData.monthlyIncome > 0 ? baseData.monthlyIncome / 160 : 20;
  const hoursOfWork = baseData.price / Math.max(hourlyRate, 1);

  const valueStrength = (baseData.necessity * 2.5) + (baseData.personalValue * 2.2) + (baseData.urgency * 1.2) + (scenario.value * 3.5);
  const usageStrength = clamp((adjustedUsesPerMonth / 25) * 20, 0, 20);
  const longevityStrength = clamp((adjustedMonths / 24) * 12, 0, 12);
  const affordabilityBoost = clamp(18 - incomeImpact * 0.75, -8, 18);
  const savingsBoost = clamp(8 - savingsImpact * 0.18, -4, 8);
  const cpuPenalty = clamp((costPerUse - 1.2) * 8, 0, 26);
  const recurringPenalty = clamp(baseData.recurringCost * 0.35, 0, 12);
  const alternativePenalty = baseData.ownsAlternative ? 10 : 0;

  const rawScore = valueStrength + usageStrength + longevityStrength + affordabilityBoost + savingsBoost + (category.bonus * 2) - cpuPenalty - recurringPenalty - alternativePenalty;
  const score = Math.round(clamp(rawScore, 0, 100));

  return {
    score,
    lifetimeCost,
    usageHorizon,
    costPerUse,
    incomeImpact,
    savingsImpact,
    hoursOfWork,
    category,
  };
}

function scenarioScores(baseData) {
  return {
    conservative: getDerivedValues(baseData, 'conservative'),
    realistic: getDerivedValues(baseData, 'realistic'),
    optimistic: getDerivedValues(baseData, 'optimistic'),
  };
}

function confidenceLabel(spread, costPerUse, usesPerMonth) {
  if (spread <= 10 && costPerUse <= 2.5 && usesPerMonth >= 10) return 'High';
  if (spread <= 18 && usesPerMonth >= 6) return 'Medium';
  return 'Low';
}

function verdictMeta(score) {
  if (score >= 76) {
    return {
      verdict: 'Worth it',
      className: 'verdict-buy',
      ring: '#22c55e',
      chip: 'Smart buy',
      title: 'Probably worth it',
    };
  }
  if (score >= 56) {
    return {
      verdict: 'Maybe',
      className: 'verdict-maybe',
      ring: '#f59e0b',
      chip: 'Needs context',
      title: 'Borderline purchase',
    };
  }
  return {
    verdict: 'Not worth it',
    className: 'verdict-skip',
    ring: '#ef4444',
    chip: 'Hold off',
    title: 'Probably not worth it',
  };
}

function sentenceForResult(data, current, scores) {
  const spread = scores.optimistic.score - scores.conservative.score;
  const confident = confidenceLabel(spread, current.costPerUse, data.usesPerMonth);

  let summary = '';
  if (current.score >= 76) {
    summary = 'Strong expected usage and decent affordability make this feel like a rational buy.';
  } else if (current.score >= 56) {
    summary = 'The purchase can make sense, but only if your usage estimate is realistic.';
  } else {
    summary = 'The current tradeoff looks weak compared with the likely real-world value you will get.';
  }

  let insight = '';
  if (current.costPerUse <= 1.5) {
    insight = 'Your projected cost per use is efficient, which is doing a lot of the heavy lifting here.';
  } else if (current.costPerUse <= 4.5) {
    insight = 'The economics are acceptable, but not automatic — consistency of use matters.';
  } else {
    insight = 'This gets expensive fast unless you use it much more than average.';
  }

  if (data.ownsAlternative) {
    insight += ' The score is also being pulled down because you already own something similar.';
  }

  return { summary, insight, confident };
}

function animateNumber(element, to) {
  cancelAnimationFrame(animationFrame);
  const from = safeNum(element.textContent, 0);
  const start = performance.now();
  const duration = 420;

  function tick(now) {
    const progress = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const next = Math.round(from + (to - from) * eased);
    element.textContent = String(next);
    if (progress < 1) {
      animationFrame = requestAnimationFrame(tick);
    }
  }

  animationFrame = requestAnimationFrame(tick);
}

function render(baseData) {
  const scores = scenarioScores(baseData);
  const current = scores[baseData.scenario] || scores.realistic;
  const meta = verdictMeta(current.score);
  const copy = sentenceForResult(baseData, current, scores);

  ui.quickLifetimeCost.textContent = eur(current.lifetimeCost);
  ui.quickCostPerUse.textContent = eur(current.costPerUse);
  ui.quickUsageHorizon.textContent = `${Math.round(current.usageHorizon)} uses`;

  animateNumber(ui.scoreValue, current.score);
  ui.scoreRing.style.setProperty('--score', current.score);
  ui.scoreRing.style.setProperty('--ring-color', meta.ring);

  ui.verdictPill.className = `verdict-pill ${meta.className}`;
  ui.verdictPill.textContent = meta.verdict;
  ui.resultTitle.textContent = meta.title;
  ui.resultSummary.textContent = copy.summary;

  ui.scenarioConservative.textContent = scores.conservative.score;
  ui.scenarioRealistic.textContent = scores.realistic.score;
  ui.scenarioOptimistic.textContent = scores.optimistic.score;

  ui.costPerUseStat.textContent = eur(current.costPerUse);
  ui.incomeImpactStat.textContent = percent(current.incomeImpact);
  ui.hoursStat.textContent = hours(current.hoursOfWork);
  ui.confidenceStat.textContent = copy.confident;

  ui.impactChip.textContent = meta.chip;
  ui.impactChip.className = 'impact-chip';
  if (meta.className === 'verdict-maybe') {
    ui.impactChip.style.background = 'rgba(245, 158, 11, 0.14)';
    ui.impactChip.style.borderColor = 'rgba(245, 158, 11, 0.24)';
    ui.impactChip.style.color = '#fcd34d';
  } else if (meta.className === 'verdict-skip') {
    ui.impactChip.style.background = 'rgba(239, 68, 68, 0.14)';
    ui.impactChip.style.borderColor = 'rgba(239, 68, 68, 0.24)';
    ui.impactChip.style.color = '#fca5a5';
  } else {
    ui.impactChip.style.background = 'rgba(34, 197, 94, 0.12)';
    ui.impactChip.style.borderColor = 'rgba(34, 197, 94, 0.2)';
    ui.impactChip.style.color = '#86efac';
  }

  ui.insightText.textContent = copy.insight;
  ui.driverText.textContent = current.costPerUse <= 2 ? 'Low projected cost per use' : current.category.driver;
  ui.cautionText.textContent = baseData.ownsAlternative ? 'You already have an alternative' : current.category.caution;

  resultCard.classList.remove('is-pulsing');
  void resultCard.offsetWidth;
  resultCard.classList.add('is-pulsing');

  lastAnalysis = {
    itemName: baseData.itemName || 'Untitled purchase',
    score: current.score,
    verdict: meta.verdict,
    price: baseData.price,
    savedPotential: meta.verdict === 'Not worth it' ? baseData.price : 0,
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

function refreshHistoryUI() {
  const history = getHistory();
  const total = history.length;
  const saved = history.reduce((sum, item) => sum + safeNum(item.savedPotential), 0);
  ui.heroAnalyses.textContent = String(total);
  ui.heroSaved.textContent = eur(saved);
  ui.savedCount.textContent = String(total);
}

function syncSliders() {
  sliderIds.forEach((id) => {
    const input = sliderMap[id];
    const valueElement = document.getElementById(`${id}Value`);
    if (!input || !valueElement) return;
    valueElement.textContent = input.value;
  });
}

function updateFromInputs() {
  syncSliders();
  render(readForm());
}

form.addEventListener('input', updateFromInputs);
form.addEventListener('change', updateFromInputs);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateFromInputs();
});

form.addEventListener('reset', () => {
  window.setTimeout(() => {
    syncSliders();
    render(readForm());
  }, 0);
});

saveAnalysisBtn.addEventListener('click', () => {
  if (!lastAnalysis) return;
  const history = getHistory();
  history.unshift(lastAnalysis);
  setHistory(history);
  refreshHistoryUI();

  const original = saveAnalysisBtn.textContent;
  saveAnalysisBtn.textContent = 'Saved';
  saveAnalysisBtn.disabled = true;
  window.setTimeout(() => {
    saveAnalysisBtn.textContent = original;
    saveAnalysisBtn.disabled = false;
  }, 1100);
});

refreshHistoryUI();
syncSliders();
render(readForm());
