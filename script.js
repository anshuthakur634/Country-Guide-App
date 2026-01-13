/*
  Country Guide App
  Code Written by Anshu Kumar
*/

const searchBtn = document.getElementById("search-btn");
const countryInp = document.getElementById("country-inp");
const result = document.getElementById("result");
const themeToggle = document.getElementById("theme-toggle");

// Events
searchBtn.addEventListener("click", fetchCountry);
countryInp.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchCountry();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Main function
async function fetchCountry() {
  const countryName = countryInp.value.trim();

  if (!countryName) {
    result.innerHTML = "<h3>Please enter a country name</h3>";
    return;
  }

  result.innerHTML = `<p class="loading">Loading country data...</p>`;

  try {
    //  REST COUNTRIES API
    const countryRes = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    const countryData = await countryRes.json();
    const country = countryData[0];

    const countryCode = country.cca2;
    const currencyKey = Object.keys(country.currencies)[0];
    const currency = country.currencies[currencyKey].name;
    const languages = Object.values(country.languages).join(", ");

    //  WORLD BANK API – GDP
    const gdpRes = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.CD?format=json`
    );
    const gdpData = await gdpRes.json();
    const gdp =
      gdpData[1]?.find((item) => item.value !== null)?.value;

    //  WORLD BANK API – PER CAPITA INCOME (GDP PER CAPITA)
    const perCapitaRes = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.PCAP.CD?format=json`
    );
    const perCapitaData = await perCapitaRes.json();
    const perCapitaIncome =
      perCapitaData[1]?.find((item) => item.value !== null)?.value;

    //  UI RENDER
    result.innerHTML = `
      <img src="${country.flags.svg}" class="flag-img" alt="Flag">

      <h2>${country.name.common}</h2>

      <div class="data-wrapper">
        <h4>Capital:</h4>
        <span>${country.capital?.[0] || "N/A"}</span>
      </div>

      <div class="data-wrapper">
        <h4>Region:</h4>
        <span>${country.region} (${country.subregion || "N/A"})</span>
      </div>

      <div class="data-wrapper">
        <h4>Population:</h4>
        <span>${country.population.toLocaleString()}</span>
      </div>

      <div class="data-wrapper">
        <h4>GDP:</h4>
        <span>
          ${gdp ? "$" + Number(gdp).toLocaleString() : "Data not available"}
        </span>
      </div>

      <div class="data-wrapper">
        <h4>Per Capita Income:</h4>
        <span>
          ${
            perCapitaIncome
              ? "$" + Number(perCapitaIncome).toLocaleString()
              : "Data not available"
          }
        </span>
      </div>

      <div class="data-wrapper">
        <h4>Currency:</h4>
        <span>${currency} (${currencyKey})</span>
      </div>

      <div class="data-wrapper">
        <h4>Languages:</h4>
        <span>${languages}</span>
      </div>

      <div class="data-wrapper">
        <h4>Map:</h4>
        <a href="${country.maps.googleMaps}" target="_blank">
          View on Google Maps
        </a>
      </div>

      <div class="learn-more">
        <a
          class="learn-btn"
          href="https://en.wikipedia.org/wiki/${country.name.common.replace(
            / /g,
            "_"
          )}"
          target="_blank"
        >
          📘 Learn More About This Country
        </a>
      </div>
    `;
  } catch (error) {
    result.innerHTML = "<h3>Country data not found. Please try again.</h3>";
    console.error(error);
  }
}
