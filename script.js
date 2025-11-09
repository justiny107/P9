// Get references to DOM elements
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const selectedProductsList = document.getElementById("selectedProductsList");
const generateRoutineBtn = document.getElementById("generateRoutine");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");

// Initial placeholder message
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

// Load product data from JSON file
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  return data.products;
}

// Display products in the grid
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
      </div>
    </div>
  `
    )
    .join("");

  // Add event listeners for product selection
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      toggleProductSelection(e.target.closest(".product-card"));
    });
  });
}

// Toggle product selection and update the selected products list
function toggleProductSelection(card) {
  card.classList.toggle("selected");

  const productId = card.dataset.id;
  const productName = card.querySelector("h3").textContent;
  const productBrand = card.querySelector("p").textContent;

  // Check if the product is already selected
  if (card.classList.contains("selected")) {
    addToSelectedProducts(productId, productName, productBrand);
  } else {
    removeFromSelectedProducts(productId);
  }
}

// Add product to the selected products list
function addToSelectedProducts(id, name, brand) {
  const productItem = document.createElement("div");
  productItem.classList.add("selected-product");
  productItem.setAttribute("data-id", id);
  productItem.innerHTML = `
    <span>${name} (${brand})</span>
    <button class="remove-btn">Remove</button>
  `;

  productItem.querySelector(".remove-btn").addEventListener("click", () => {
    removeFromSelectedProducts(id);
    document.querySelector(`.product-card[data-id="${id}"]`).classList.remove("selected");
  });

  selectedProductsList.appendChild(productItem);
  updateLocalStorage();
}

// Remove product from the selected products list
function removeFromSelectedProducts(id) {
  const productItem = selectedProductsList.querySelector(`[data-id="${id}"]`);
  if (productItem) {
    selectedProductsList.removeChild(productItem);
    updateLocalStorage();
  }
}

// Update selected products in localStorage
function updateLocalStorage() {
  const selectedProductIds = Array.from(selectedProductsList.children).map(
    (item) => item.dataset.id
  );
  localStorage.setItem("selectedProducts", JSON.stringify(selectedProductIds));
}

// Load selected products from localStorage when the page loads
function loadSelectedProducts() {
  const selectedProductIds = JSON.parse(localStorage.getItem("selectedProducts")) || [];
  const allProducts = document.querySelectorAll(".product-card");

  selectedProductIds.forEach((id) => {
    const productCard = Array.from(allProducts).find((card) => card.dataset.id === id);
    if (productCard) {
      productCard.classList.add("selected");
      addToSelectedProducts(
        productCard.dataset.id,
        productCard.querySelector("h3").textContent,
        productCard.querySelector("p").textContent
      );
    }
  });
}

// Generate personalized routine (placeholder for actual AI integration)
generateRoutineBtn.addEventListener("click", () => {
  const selectedProducts = Array.from(selectedProductsList.children).map((item) => ({
    name: item.querySelector("span").textContent.split(" (")[0],
    brand: item.querySelector("span").textContent.split(" (")[1].replace(")", ""),
  }));

  if (selectedProducts.length === 0) {
    alert("Please select at least one product to generate a routine.");
    return;
  }

  // Call API or AI for generating routine
  const routine = generateRoutine(selectedProducts);
  displayRoutine(routine);
});

// Placeholder AI routine generation
function generateRoutine(products) {
  // Example: Create a simple routine based on selected products
  return `
    <div>
      <h3>Your Personalized Routine:</h3>
      <ul>
        ${products
          .map(
            (product) => `
          <li>${product.name} by ${product.brand}</li>
        `
          )
          .join("")}
      </ul>
      <p>This is a simple example of your routine. The real routine will be generated based on your selections and needs.</p>
    </div>
  `;
}

// Display the generated routine in the chat window
function displayRoutine(routine) {
  chatWindow.innerHTML = routine;
  chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to bottom
}

// Handle chat form submission (ask follow-up questions)
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userInput = document.getElementById("userInput").value;
  if (!userInput) return;

  chatWindow.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
  document.getElementById("userInput").value = "";

  // For now, we just give a placeholder response
  chatWindow.innerHTML += `<p><strong>AI:</strong> Thank you for your question. I'll provide more personalized advice once the routine is generated!</p>`;

  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Load products when the page is ready
categoryFilter.addEventListener("change", async (e) => {
  const selectedCategory = e.target.value;
  const products = await loadProducts();
  const filteredProducts = products.filter((product) => product.category === selectedCategory);

  displayProducts(filteredProducts);
  loadSelectedProducts(); // Load saved selections from localStorage
});

// Load all products initially if no category is selected
window.addEventListener("load", async () => {
  const products = await loadProducts();
  displayProducts(products);
});
