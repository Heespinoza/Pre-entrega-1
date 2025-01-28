const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.inicializarArchivo();
  }

  async inicializarArchivo() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      if (error.code === 'El archivo no existe') {
        await fs.writeFile(this.filePath, '[]');
        console.log(`Archivo ${this.filePath} creado`);
      }
    }
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = {
      id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
      ...product,
    };
    products.push(newProduct);
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    console.log('Producto agregado');
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('El archivo no existe');
        return [];
      } else {
        console.error('Error al leer los productos');
      }
    }
  }

  async getProductById(productId) {
    const products = await this.getProducts();
    return products.find((product) => product.id === productId) || null;
  }

  async updateProduct(productId, updates) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      return null;
    }
    products[productIndex] = { ...products[productIndex], ...updates, id: productId };
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    console.log('Producto actualizado');
    return products[productIndex];
  }

  async deleteProduct(productId) {
    const products = await this.getProducts();
    const updatedProducts = products.filter((product) => product.id !== productId);
    await fs.writeFile(this.filePath, JSON.stringify(updatedProducts, null, 2));
    console.log('Producto eliminado');
  }
}

module.exports = ProductManager;