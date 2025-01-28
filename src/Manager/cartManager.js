const fs = require('fs').promises;

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.inicializarArchivo();
  }

  async inicializarArchivo() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(this.filePath, '[]');
        console.log(`Archivo ${this.filePath} creado`);
      }
    }
  }

  async addCart() {
    const carts = await this.getCarts();
    const newCart = { id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1, products: [] };
    carts.push(newCart);
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    console.log('Carrito creado');
    return newCart;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('El archivo no existe');
        return [];
      } else {
        console.error('Error al leer los carritos');
      }
    }
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();
    return carts.find((cart) => cart.id === cartId) || null;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) return null;

    const productIndex = cart.products.findIndex((p) => p.product === productId);
    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }

    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    console.log('Producto agregado al carrito');
    return cart;
  }
}

module.exports = CartManager;