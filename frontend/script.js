const API_URL = "http://localhost:3000";
const USER_ID = 1;

async function loadUserView() {
  try {
    const userResponse = await fetch(`${API_URL}/api/users/${USER_ID}`);
    const user = await userResponse.json();

    document.getElementById("userCredits").textContent = user.credits;

    const productsResponse = await fetch(`${API_URL}/api/products`);
    const products = await productsResponse.json();

    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";

    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.innerHTML = `
        <hr>
        <p><strong>ID:</strong> ${product.id}</p>
        <p><strong>Nome:</strong> ${product.name}</p>
        <p><strong>Prezzo:</strong> ${product.price} crediti</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
        <button onclick="buyProduct(${product.id})">Compra</button>
      `;
      productsContainer.appendChild(productDiv);
    });
  } catch (error) {
    console.error("Errore nel caricamento vista utente:", error);
  }
}

async function buyProduct(productId) {
  try {
    const response = await fetch(`${API_URL}/api/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: USER_ID,
        productId: productId
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert(data.message);
    loadUserView();
  } catch (error) {
    console.error("Errore durante l'acquisto:", error);
  }
}

async function loadAdminProducts() {
  const adminProductsContainer = document.getElementById("adminProducts");
  if (!adminProductsContainer) return;

  try {
    const response = await fetch(`${API_URL}/api/products`);
    const products = await response.json();

    adminProductsContainer.innerHTML = "";

    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.innerHTML = `
        <hr>
        <p><strong>ID:</strong> ${product.id}</p>
        <p><strong>Nome:</strong> ${product.name}</p>
        <p><strong>Prezzo:</strong> ${product.price} crediti</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
      `;
      adminProductsContainer.appendChild(productDiv);
    });
  } catch (error) {
    console.error("Errore nel caricamento prodotti admin:", error);
  }
}

async function addProduct() {
  const name = document.getElementById("productName").value;
  const price = Number(document.getElementById("productPrice").value);
  const stock = Number(document.getElementById("productStock").value);

  try {
    const response = await fetch(`${API_URL}/api/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, price, stock })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert(data.message);
    loadAdminProducts();
  } catch (error) {
    console.error("Errore aggiunta prodotto:", error);
  }
}

async function updateStock() {
  const productId = Number(document.getElementById("stockProductId").value);
  const stock = Number(document.getElementById("newStock").value);

  try {
    const response = await fetch(`${API_URL}/api/admin/products/${productId}/stock`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ stock })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert(data.message);
    loadAdminProducts();
  } catch (error) {
    console.error("Errore aggiornamento stock:", error);
  }
}

async function addCredits() {
  const userId = Number(document.getElementById("creditsUserId").value);
  const credits = Number(document.getElementById("bonusCredits").value);

  try {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}/credits`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ credits })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert(data.message);
  } catch (error) {
    console.error("Errore aggiunta crediti:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("products")) {
    loadUserView();
  }

  if (document.getElementById("addProductBtn")) {
    document.getElementById("addProductBtn").addEventListener("click", addProduct);
    document.getElementById("updateStockBtn").addEventListener("click", updateStock);
    document.getElementById("addCreditsBtn").addEventListener("click", addCredits);
    loadAdminProducts();
  }
});