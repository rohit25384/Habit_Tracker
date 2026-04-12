const API_URL = "./cars.json";

const statusText = document.getElementById("statusText");
const categorySelect = document.getElementById("categorySelect");
const brandSelect = document.getElementById("brandSelect");
const sortSelect = document.getElementById("sortSelect");
const firstCarSelect = document.getElementById("firstCarSelect");
const secondCarSelect = document.getElementById("secondCarSelect");
const compareButton = document.getElementById("compareButton");
const compareResult = document.getElementById("compareResult");
const resultsInfo = document.getElementById("resultsInfo");
const carGrid = document.getElementById("carGrid");
const emptyMessage = document.getElementById("emptyMessage");

let cars = [];

function formatPrice(price) {
  return "Rs " + price.toLocaleString("en-IN");
}

function mileageNumber(mileageText) {
  return Number(String(mileageText).replace(/[^0-9.]/g, "")) || 0;
}

function showOptions(selectBox, items) {
  for (let i = 0; i < items.length; i += 1) {
    const option = document.createElement("option");
    option.value = items[i];
    option.textContent = items[i];
    selectBox.appendChild(option);
  }
}

function fillDropdowns() {
  const categories = [];
  const brands = [];
  const carNames = [];

  for (let i = 0; i < cars.length; i += 1) {
    if (!categories.includes(cars[i].bodyType)) {
      categories.push(cars[i].bodyType);
    }

    if (!brands.includes(cars[i].brand)) {
      brands.push(cars[i].brand);
    }

    carNames.push(cars[i].name);
  }

  categories.sort();
  brands.sort();
  carNames.sort();

  showOptions(categorySelect, categories);
  showOptions(brandSelect, brands);
  showOptions(firstCarSelect, carNames);
  showOptions(secondCarSelect, carNames);
}

function carMatchesFilters(car) {
  if (categorySelect.value !== "all" && car.bodyType !== categorySelect.value) {
    return false;
  }

  if (brandSelect.value !== "all" && car.brand !== brandSelect.value) {
    return false;
  }

  return true;
}

function sortCars(carList) {
  if (sortSelect.value === "price-low") {
    carList.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (sortSelect.value === "price-high") {
    carList.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (sortSelect.value === "mileage-low") {
    carList.sort(function (a, b) {
      return mileageNumber(a.mileage) - mileageNumber(b.mileage);
    });
  } else if (sortSelect.value === "mileage-high") {
    carList.sort(function (a, b) {
      return mileageNumber(b.mileage) - mileageNumber(a.mileage);
    });
  } else if (sortSelect.value === "brand") {
    carList.sort(function (a, b) {
      return a.brand.localeCompare(b.brand);
    });
  } else if (sortSelect.value === "category") {
    carList.sort(function (a, b) {
      return a.bodyType.localeCompare(b.bodyType);
    });
  }
}

function createCard(car) {
  const card = document.createElement("div");
  card.className = "product-card";

    const imageLink = document.createElement("a");
  imageLink.href = car.image;
  imageLink.target = "_blank";
  imageLink.rel = "noopener noreferrer";
  
  const image = document.createElement("img");
  image.className = "product-image";
  image.src = car.image;
  image.alt = car.name;

  const content = document.createElement("div");
  content.className = "product-content";

  const smallTitle = document.createElement("p");
  smallTitle.className = "product-category";
  smallTitle.textContent = car.bodyType + " | " + car.type;

  const title = document.createElement("h3");
  title.textContent = car.name;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent =
    car.brand +
    " from " +
    car.country +
    ". Mileage: " +
    car.mileage +
    ". Distance driven: " +
    car.kmDriven.toLocaleString("en-IN") +
    " km.";

  const details = document.createElement("div");
  details.className = "product-meta";
  details.innerHTML =
    "<span>" +
    formatPrice(car.price) +
    "</span>" +
    "<span>" +
    car.mileage +
    "</span>" +
    "<span>" +
    car.brand +
    "</span>";

  const footer = document.createElement("p");
  footer.className = "car-note";
  footer.textContent = car.country + " | " + car.bodyType;

  content.appendChild(smallTitle);
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(details);
  content.appendChild(footer);
  card.appendChild(image);
  card.appendChild(content);

  imageLink.appendChild(image);
  card.appendChild(imageLink);
  card.appendChild(content);

  return card;
}

function findCarByName(name) {
  for (let i = 0; i < cars.length; i += 1) {
    if (cars[i].name === name) {
      return cars[i];
    }
  }

  return null;
}

function createCompareCarBlock(car) {
  const box = document.createElement("div");
  box.className = "compare-car";

  const image = document.createElement("img");
  image.className = "compare-image";
  image.src = car.image;
  image.alt = car.name;

  const title = document.createElement("h3");
  title.textContent = car.name;

  const info = document.createElement("p");
  info.className = "compare-text";
  info.textContent =
    car.brand +
    " from " +
    car.country +
    ". Price: " +
    formatPrice(car.price) +
    ". Mileage: " +
    car.mileage +
    ". Distance driven: " +
    car.kmDriven.toLocaleString("en-IN") +
    " km. Category: " +
    car.bodyType +
    ".";

  box.appendChild(image);
  box.appendChild(title);
  box.appendChild(info);

  return box;
}

function showComparison() {
  compareResult.innerHTML = "";

  if (firstCarSelect.value === "" || secondCarSelect.value === "") {
    compareResult.textContent = "Select two cars to compare.";
    return;
  }

  if (firstCarSelect.value === secondCarSelect.value) {
    compareResult.textContent = "Please choose two different cars.";
    return;
  }

  const firstCar = findCarByName(firstCarSelect.value);
  const secondCar = findCarByName(secondCarSelect.value);

  if (!firstCar || !secondCar) {
    compareResult.textContent = "Could not find one of the selected cars.";
    return;
  }

  const compareCard = document.createElement("div");
  compareCard.className = "compare-card";

  compareCard.appendChild(createCompareCarBlock(firstCar));
  compareCard.appendChild(createCompareCarBlock(secondCar));

  compareResult.appendChild(compareCard);
}

function renderCars() {
  carGrid.innerHTML = "";

  const visibleCars = [];

  for (let i = 0; i < cars.length; i += 1) {
    if (carMatchesFilters(cars[i])) {
      visibleCars.push(cars[i]);
    }
  }

  sortCars(visibleCars);

  resultsInfo.textContent = "Showing " + visibleCars.length + " cars";

  if (visibleCars.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  for (let i = 0; i < visibleCars.length; i += 1) {
    carGrid.appendChild(createCard(visibleCars[i]));
  }
}

async function loadCars() {
  statusText.textContent = "Loading cars...";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Fetch failed");
    }

    cars = await response.json();
    fillDropdowns();
    statusText.textContent = "Cars loaded successfully.";
  } catch (error) {
    statusText.textContent =
      "Cars could not load. Please run the project with a local server.";
  }

  renderCars();
}

categorySelect.addEventListener("change", renderCars);
brandSelect.addEventListener("change", renderCars);
sortSelect.addEventListener("change", renderCars);
compareButton.addEventListener("click", showComparison);

loadCars();
