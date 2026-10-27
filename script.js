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
const packageNavEl = document.getElementById('packageNav');
const bulkRangeListEl = document.getElementById('bulkRangeList');
const addPackageBtn = document.getElementById('addPackageBtn');
const addBulkBtn = document.getElementById('addBulkBtn');

const starterTiers = [
  { id: 'starter-1', label: 'Bulk 1', min: 0, max: 50, rate: 3.5 },
  { id: 'starter-2', label: 'Bulk 2', min: 50, max: 100, rate: 3.15 },
  { id: 'starter-3', label: 'Bulk 3', min: 100, max: 200, rate: 2.9 }
];

const proTiers = [
  { id: 'pro-1', label: 'Bulk 1', min: 0, max: 50, rate: 3.1 },
  { id: 'pro-2', label: 'Bulk 2', min: 50, max: 100, rate: 2.75 },
  { id: 'pro-3', label: 'Bulk 3', min: 100, max: 200, rate: 2.45 }
];

const eliteTiers = [
  { id: 'elite-1', label: 'Bulk 1', min: 0, max: 50, rate: 2.85 },
  { id: 'elite-2', label: 'Bulk 2', min: 50, max: 100, rate: 2.5 },
  { id: 'elite-3', label: 'Bulk 3', min: 100, max: 200, rate: 2.2 }
];

let packages = [
  { id: 'package-1', priority: 1, name: 'Package 1', tiers: starterTiers },
  { id: 'package-2', priority: 2, name: 'Package 2', tiers: proTiers },
  { id: 'package-3', priority: 3, name: 'Package 3', tiers: eliteTiers }
];

let selectedPackageId = 'package-1';
let selectedTierId = 'starter-1';

function formatCurrency(value) {
  return `${Number(value).toFixed(2)} EP`;
}

function getSelectedPackage() {
  return packages.find((item) => item.id === selectedPackageId) || packages[0];
}

function getSelectedTier() {
  const selectedPackage = getSelectedPackage();
  return selectedPackage.tiers.find((tier) => tier.id === selectedTierId) || selectedPackage.tiers[0];
}

function renderPackageNav() {
  packageNavEl.innerHTML = '';

  packages.forEach((packageItem, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `package-item ${packageItem.id === selectedPackageId ? 'active' : ''}`;
    button.setAttribute('data-id', packageItem.id);
    button.innerHTML = `
      <span class="package-number">${index + 1}</span>
      <span class="package-text">${packageItem.name}</span>
    `;

    button.addEventListener('click', () => {
      selectedPackageId = packageItem.id;
      const firstTier = packageItem.tiers[0];
      selectedTierId = firstTier.id;
      renderUI();
      calculateTotal();
    });

    packageNavEl.appendChild(button);
  });
}

function renderBulkTiers() {
  const selectedPackage = getSelectedPackage();
  bulkRangeListEl.innerHTML = '';

  selectedPackage.tiers.forEach((tier, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `range-tab ${tier.id === selectedTierId ? 'active' : ''}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(tier.id === selectedTierId));
    button.innerHTML = `
      <span class="range-badge">${index + 1}</span>
      <span>${tier.label}</span>
      <small>${tier.min}-${tier.max}</small>
    `;

    button.addEventListener('click', () => {
      selectedTierId = tier.id;
      renderUI();
      calculateTotal();
    });

    bulkRangeListEl.appendChild(button);
  });

  const selectedTier = getSelectedTier();
  packageNameEl.textContent = selectedPackage.name;
  packageRateDisplayEl.textContent = `${selectedTier.rate.toFixed(2)} EP / piece`;
}

function renderUI() {
  renderPackageNav();
  renderBulkTiers();
}

function addPackage() {
  const nextNumber = packages.length + 1;
  const newPackageId = `package-${nextNumber}`;
  const newPackage = {
    id: newPackageId,
    priority: nextNumber,
    name: `Package ${nextNumber}`,
    tiers: [
      { id: `${newPackageId}-1`, label: 'Bulk 1', min: 0, max: 50, rate: Number((3.5 - nextNumber * 0.2).toFixed(2)) },
      { id: `${newPackageId}-2`, label: 'Bulk 2', min: 50, max: 100, rate: Number((3.15 - nextNumber * 0.18).toFixed(2)) },
      { id: `${newPackageId}-3`, label: 'Bulk 3', min: 100, max: 200, rate: Number((2.9 - nextNumber * 0.14).toFixed(2)) }
    ]
  };

  packages.push(newPackage);
  selectedPackageId = newPackageId;
  selectedTierId = newPackage.tiers[0].id;
  renderUI();
  calculateTotal();
}

function addBulkTier() {
  const selectedPackage = getSelectedPackage();
  const nextTierNum = selectedPackage.tiers.length + 1;
  const lastTier = selectedPackage.tiers[selectedPackage.tiers.length - 1];
  const newTier = {
    id: `${selectedPackage.id}-${nextTierNum}`,
    label: `Bulk ${nextTierNum}`,
    min: lastTier.max,
    max: lastTier.max + 100,
    rate: Number((lastTier.rate * 0.9).toFixed(2))
  };

  selectedPackage.tiers.push(newTier);
  selectedTierId = newTier.id;
  renderUI();
  calculateTotal();
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
  const selectedTier = getSelectedTier();

  const perPieceCost = pieces * selectedTier.rate;
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
addPackageBtn.addEventListener('click', addPackage);
addBulkBtn.addEventListener('click', addBulkTier);

renderUI();
calculateTotal();
