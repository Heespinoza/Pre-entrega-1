const express = require("express");
const CartManager = require("../managers/cartManager");

const router = express.Router();
const cartManager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

router.get("/:cid", async (req, res) => {
    const cart = await cartManager.getCartById(Number(req.params.cid));
    cart ? res.json(cart.products) : res.status(404).json({ error: "Carrito no encontrado" });
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cart = await cartManager.addProductToCart(Number(req.params.cid), Number(req.params.pid));
    cart ? res.json(cart) : res.status(404).json({ error: "Carrito o producto no encontrado" });
});

module.exports = router;
