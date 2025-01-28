const express = require('express');
const ProductManager = require('./Manager/productManager');
const CartManager = require('./Manager/cartManager');

const app = express();
const PORT = 8080;

const productManager = new ProductManager('./src/data/products.json');
const cartManager = new CartManager('./src/data/carts.json');

app.use(express.json());

// Rutas para productos
app.get('/api/products', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

app.get('/api/products/:pid', async (req, res) => {
  const product = await productManager.getProductById(Number(req.params.pid));
  if (product) res.json(product);
  else res.status(404).json({ error: 'Producto no encontrado' });
});

app.post('/api/products', async (req, res) => {
  await productManager.addProduct(req.body);
  res.status(201).json({ message: 'Producto creado' });
});

// Rutas para carritos
app.post('/api/carts', async (req, res) => {
  const newCart = await cartManager.addCart();
  res.status(201).json(newCart);
});

app.get('/api/carts/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(Number(req.params.cid));
  if (cart) res.json(cart.products);
  else res.status(404).json({ error: 'Carrito no encontrado' });
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  const cart = await cartManager.addProductToCart(Number(req.params.cid), Number(req.params.pid));
  if (cart) res.json(cart);
  else res.status(404).json({ error: 'Carrito o producto no encontrado' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});