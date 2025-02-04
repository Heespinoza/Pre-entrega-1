const fs = require("fs").promises;

class CartManager{


constructor(path){
    
    this.path = path;
} 
async createCart() {
    const carts = await this.getCarts();
    const newCart = { id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1, products: [] };
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
}

async getCarts() {
    try {
        const data = await fs.readFile(this.path, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id) || null;
}

async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cartId);

    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product === productId);
    if (productIndex === -1) {
        cart.products.push({ product: productId, quantity: 1 });
    } else {
        cart.products[productIndex].quantity++;
    }

    await this.saveCarts(carts);
    return cart;
}

async saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
}
}

module.exports = CartManager;

