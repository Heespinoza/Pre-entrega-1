const express = require("express");
const ProductManager = require("../managers/productManager.js");

const router = express.Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get("/:pid", async (req, res) => {
    const product = await productManager.getProductById(Number(req.params.pid));
    product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
});

router.post("/", async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
    const updatedProduct = await productManager.updateProduct(Number(req.params.pid), req.body);
    updatedProduct ? res.json(updatedProduct) : res.status(404).json({ error: "Producto no encontrado" });
});

router.delete("/:pid", async (req, res) => {
    await productManager.deleteProduct(Number(req.params.pid));
    res.status(204).send();
});

module.exports = router;
