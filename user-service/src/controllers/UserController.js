const UserUseCase = require('../usecases/UserUseCase');
const Joi = require('joi');
const rabbitMQ = require('../../../shared/rabbitmq/connection');

class UserController {
  constructor() {
    this.userUseCase = new UserUseCase();
    this.setupProductListener();
  }

  async getProfile(req, res) {
    try {
      const profile = await this.userUseCase.getProfile(req.userId);
      res.json(profile);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async addBankDetails(req, res) {
    try {
      const schema = Joi.object({
        bankName: Joi.string().required(),
        accountNumber: Joi.string().required(),
        routingNumber: Joi.string().required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const bankDetails = await this.userUseCase.addBankDetails(req.userId, value);
      res.status(201).json(bankDetails);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateBankDetail(req, res) {
    try {
      const schema = Joi.object({
        bankName: Joi.string().required(),
        accountNumber: Joi.string().required(),
        routingNumber: Joi.string().required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const bankDetails = await this.userUseCase.updateBankDetail(
        req.userId,
        req.params.bankDetailId,
        value
      );
      res.json(bankDetails);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteBankDetail(req, res) {
    try {
      const bankDetails = await this.userUseCase.deleteBankDetail(
        req.userId,
        req.params.bankDetailId
      );
      res.json(bankDetails);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProducts(req, res) {
    try {
      // Request products from admin service via RabbitMQ
      await rabbitMQ.publish('product_request', { action: 'list', userId: req.userId });
      
      // In a real implementation, you'd wait for the response or use a different pattern
      res.json({ message: 'Product request sent. Check product_response queue.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async setupProductListener() {
    try {
      await rabbitMQ.consume('product_response', (data) => {
        console.log('Received product data:', data);
        // Handle product data received from admin service
      });
    } catch (error) {
      console.error('Error setting up product listener:', error);
    }
  }
}

module.exports = UserController;