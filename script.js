const gramsInput = document.getElementById('grams');
const daysInput = document.getElementById('days');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const rateInput = document.getElementById('rate');
const piecesInput = document.getElementById('pieces');
const totalCostEl = document.getElementById('totalCost');
const gramsCostEl = document.getElementById('gramsCost');
const timeCostEl = document.getElementById('timeCost');
const totalCostRowEl = document.getElementById('totalCostRow');
const packageCostEl = document.getElementById('packageCost');
const calculateBtn = document.getElementById('calculateBtn');
const packageNameEl = document.getElementById('packageName');
const packageRateDisplayEl = document.getElementById('packageRateDisplay');

const PACKAGE_CONFIG = {
  starter: {
    name: 'Package 1',
    bands: {
      '0-50': 3.5,
      '50-100': 3.15,
      '100-200': 2.9
    }
  },
  pro: {
    name: 'Package 2',
    bands: {
      '0-50': 3.1,
      '50-100': 2.75,
      '100-200': 2.45
    }
  },
  elite: {
    name: 'Package 3',
    bands: {
      '0-50': 2.85,
      '50-100': 2.5,
      '100-200': 2.2
    }
  }
};

let selectedPackage = 'starter';
let selectedRange = '0-50';

function formatCurrency(value) {
  return `${Number(value).toFixed(2)} EP`;
}

function updatePackageDisplay() {
  const packageConfig = PACKAGE_CONFIG[selectedPackage];
  const unitRate = packageConfig.bands[selectedRange];

  packageNameEl.textContent = packageConfig.name;
  packageRateDisplayEl.textContent = `${unitRate.toFixed(2)} EP / piece`;

  document.querySelectorAll('.package-tab').forEach((button) => {
    const isActive = button.dataset.package === selectedPackage;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  document.querySelectorAll('.range-tab').forEach((button) => {
    const isActive = button.dataset.range === selectedRange;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });
}

function calculateTotal() {
  const grams = Number(gramsInput.value) || 0;
  const days = Number(daysInput.value) || 0;
  const hours = Number(hoursInput.value) || 0;
  const minutes = Number(minutesInput.value) || 0;
  const hourlyRate = Number(rateInput.value) || 100;
  const pieces = Number(piecesInput.value) || 0;

  const totalMinutes = minutes + hours * 60 + days * 24 * 60;
  const totalHours = totalMinutes / 60;

  const gramsCost = grams * 1;
  const timeCost = totalHours * hourlyRate;
  const baseCost = gramsCost + timeCost;

  const packageConfig = PACKAGE_CONFIG[selectedPackage];
  const unitRate = packageConfig.bands[selectedRange];
  const perPieceCost = pieces * unitRate;
  const minimumProtectedCost = baseCost * 1.1;
  const packageOrderCost = Math.max(perPieceCost, pieces > 0 ? minimumProtectedCost : 0);
  const totalCost = baseCost + packageOrderCost;

  totalCostEl.textContent = totalCost.toFixed(2);
  gramsCostEl.textContent = formatCurrency(gramsCost);
  timeCostEl.textContent = formatCurrency(timeCost);
  packageCostEl.textContent = formatCurrency(packageOrderCost);
  totalCostRowEl.textContent = formatCurrency(totalCost);
}

[gramsInput, daysInput, hoursInput, minutesInput, rateInput, piecesInput].forEach((input) => {
  input.addEventListener('input', calculateTotal);
});

calculateBtn.addEventListener('click', calculateTotal);

document.querySelectorAll('.package-tab').forEach((button) => {
  button.addEventListener('click', () => {
    selectedPackage = button.dataset.package;
    updatePackageDisplay();
    calculateTotal();
  });
});

document.querySelectorAll('.range-tab').forEach((button) => {
  button.addEventListener('click', () => {
    selectedRange = button.dataset.range;
    updatePackageDisplay();
    calculateTotal();
  });
});

updatePackageDisplay();
calculateTotal();
