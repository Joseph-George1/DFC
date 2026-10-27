const gramsInput = document.getElementById('grams');
const daysInput = document.getElementById('days');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const rateInput = document.getElementById('rate');
const totalCostEl = document.getElementById('totalCost');
const gramsCostEl = document.getElementById('gramsCost');
const timeCostEl = document.getElementById('timeCost');
const totalCostRowEl = document.getElementById('totalCostRow');
const calculateBtn = document.getElementById('calculateBtn');

function formatCurrency(value) {
  return `${Number(value).toFixed(2)} EP`;
}

function calculateTotal() {
  const grams = Number(gramsInput.value) || 0;
  const days = Number(daysInput.value) || 0;
  const hours = Number(hoursInput.value) || 0;
  const minutes = Number(minutesInput.value) || 0;
  const hourlyRate = Number(rateInput.value) || 100;

  const totalMinutes = minutes + hours * 60 + days * 24 * 60;
  const totalHours = totalMinutes / 60;

  const gramsCost = grams * 1;
  const timeCost = totalHours * hourlyRate;
  const totalCost = gramsCost + timeCost;

  totalCostEl.textContent = totalCost.toFixed(2);
  gramsCostEl.textContent = formatCurrency(gramsCost);
  timeCostEl.textContent = formatCurrency(timeCost);
  totalCostRowEl.textContent = formatCurrency(totalCost);
}

[gramsInput, daysInput, hoursInput, minutesInput, rateInput].forEach((input) => {
  input.addEventListener('input', calculateTotal);
});

calculateBtn.addEventListener('click', calculateTotal);

calculateTotal();
