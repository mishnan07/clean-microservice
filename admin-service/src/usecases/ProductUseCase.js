const ProductRepository = require('../repositories/ProductRepository');
const rabbitMQ = require('../../../shared/rabbitmq/connection');

class ProductUseCase {
  constructor() {
    this.productRepository = new ProductRepository();
    this.setupProductRequestListener();
  }

  async createProduct(productData) {
    const product = await this.productRepository.create(productData);
    
    // Notify user service about new product
    await rabbitMQ.publish('product_created', {
      action: 'created',
      product: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category
      }
    });

    return product;
  }

  async getAllProducts() {
    return await this.productRepository.findAll();
  }

  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async updateProduct(id, updateData) {
    const product = await this.productRepository.update(id, updateData);
    if (!product) {
      throw new Error('Product not found');
    }

    // Notify user service about product update
    await rabbitMQ.publish('product_updated', {
      action: 'updated',
      product: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category
      }
    });

    return product;
  }

  async deleteProduct(id) {
    const product = await this.productRepository.delete(id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Notify user service about product deletion
    await rabbitMQ.publish('product_deleted', {
      action: 'deleted',
      productId: id
    });

    return product;
  }

  async setupProductRequestListener() {
    try {
      await rabbitMQ.consume('product_request', async (data) => {
        if (data.action === 'list') {
          const products = await this.getAllProducts();
          await rabbitMQ.publish('product_response', {
            userId: data.userId,
            products: products.map(p => ({
              id: p._id,
              name: p.name,
              description: p.description,
              price: p.price,
              category: p.category
            }))
          });
        }
      });
    } catch (error) {
      console.error('Error setting up product request listener:', error);
    }
  }
}

module.exports = ProductUseCase;