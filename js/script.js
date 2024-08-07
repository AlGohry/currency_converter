const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");

const apiKey = "YOUR_API_KEY"; // Use a proxy server to keep this secure

// Populate currency dropdowns
dropList.forEach((select, i) => {
  Object.keys(country_list).forEach(currency_code => {
    const selected = (i === 0 && currency_code === "USD") || (i === 1 && currency_code === "SAR") ? "selected" : "";
    const optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    select.insertAdjacentHTML("beforeend", optionTag);
  });

  select.addEventListener("change", e => loadFlag(e.target));
});

function loadFlag(element) {
  const code = element.value;
  const imgTag = element.parentElement.querySelector("img");
  imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
}

window.addEventListener("load", getExchangeRate);

getButton.addEventListener("click", e => {
  e.preventDefault();
  getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
  [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

async function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value || "1";
  amount.value = amountVal;

  exchangeRateTxt.innerText = "Getting exchange rate...";

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const result = await response.json();
    const exchangeRate = result.conversion_rates[toCurrency.value];
    const totalExRate = (amountVal * exchangeRate).toFixed(2);
    exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
  } catch (error) {
    exchangeRateTxt.innerText = `Error: ${error.message}`;
  }
}
