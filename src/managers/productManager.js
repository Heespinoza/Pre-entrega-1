const fs = require("fs").promises;

class ProductManager {
    constructor(path) {
        
        this.path = path;
    }

    async addProduct({ title, description, price, code, stock, category, thumbnails }) {
        try {
            const products = await this.getProducts();

            if (!title || !description || !price || !code || !stock || !category) {
                throw new Error("Todos los campos son obligatorios.");
            }

            if (products.some(item => item.code === code)) {
                throw new Error("El código debe ser único.");
            }

            const newProduct = {
                id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
                title,
                description,
                price,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || [],
            };

            products.push(newProduct);
            await this.saveProducts(products);
            return newProduct;
        } catch (error) {
            console.error(error);
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            console.log("estoy aca")
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id) || null;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return null;

        products[index] = { ...products[index], ...updates, id };
        await this.saveProducts(products);
        return products[index];
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        products = products.filter(p => p.id !== id);
        await this.saveProducts(products);
    }

    async saveProducts(products) {
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}

module.exports = ProductManager;
