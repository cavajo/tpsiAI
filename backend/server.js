const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const PRODUCTS_FILE = "products.json";
const USERS_FILE = "users.json";

function readProducts() {
  const data = fs.readFileSync(PRODUCTS_FILE, "utf8");
  return JSON.parse(data);
}

function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

function readUsers() {
  const data = fs.readFileSync(USERS_FILE, "utf8");
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.get("/", (req, res) => {
  res.send("Backend e-commerce attivo");
});

app.get("/api/products", (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.get("/api/users", (req, res) => {
  const users = readUsers();
  res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const users = readUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "Utente non trovato" });
  }

  res.json(user);
});

app.post("/api/purchase", (req, res) => {
  const { userId, productId } = req.body;

  const users = readUsers();
  const products = readProducts();

  const user = users.find((u) => u.id === userId);
  const product = products.find((p) => p.id === productId);

  if (!user) {
    return res.status(404).json({ error: "Utente non trovato" });
  }

  if (!product) {
    return res.status(404).json({ error: "Prodotto non trovato" });
  }

  if (product.stock <= 0) {
    return res.status(400).json({ error: "Prodotto esaurito" });
  }

  if (user.credits < product.price) {
    return res.status(400).json({ error: "Crediti insufficienti" });
  }

  user.credits -= product.price;
  product.stock -= 1;

  writeUsers(users);
  writeProducts(products);

  res.json({
    message: "Acquisto completato con successo",
    user,
    product
  });
});

app.post("/api/admin/products", (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || price == null || stock == null) {
    return res.status(400).json({ error: "Dati prodotto mancanti" });
  }

  const products = readProducts();

  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    name,
    price,
    stock
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json({
    message: "Prodotto aggiunto con successo",
    product: newProduct
  });
});

app.put("/api/admin/products/:id/stock", (req, res) => {
  const productId = parseInt(req.params.id);
  const { stock } = req.body;

  const products = readProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: "Prodotto non trovato" });
  }

  if (stock == null || stock < 0) {
    return res.status(400).json({ error: "Stock non valido" });
  }

  product.stock = stock;
  writeProducts(products);

  res.json({
    message: "Stock aggiornato con successo",
    product
  });
});

app.put("/api/admin/users/:id/credits", (req, res) => {
  const userId = parseInt(req.params.id);
  const { credits } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "Utente non trovato" });
  }

  if (credits == null || credits < 0) {
    return res.status(400).json({ error: "Crediti non validi" });
  }

  user.credits += credits;
  writeUsers(users);

  res.json({
    message: "Crediti aggiunti con successo",
    user
  });
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});