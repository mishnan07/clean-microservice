const ProductUseCase = require('../usecases/ProductUseCase');
const Joi = require('joi');

class ProductController {
  constructor() {
    this.productUseCase = new ProductUseCase();
  }

  async createProduct(req, res) {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().positive().required(),
        category: Joi.string().required(),
        stock: Joi.number().min(0).default(0)
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const product = await this.productUseCase.createProduct(value);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productUseCase.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await this.productUseCase.getProductById(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const schema = Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number().positive(),
        category: Joi.string(),
        stock: Joi.number().min(0)
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const product = await this.productUseCase.updateProduct(req.params.id, value);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await this.productUseCase.deleteProduct(req.params.id);
      res.json({ message: 'Product deleted successfully', product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ProductController;