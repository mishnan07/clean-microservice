const AdminAuthUseCase = require('../usecases/AdminAuthUseCase');
const Joi = require('joi');

class AdminAuthController {
  constructor() {
    this.adminAuthUseCase = new AdminAuthUseCase();
  }

  async register(req, res) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const result = await this.adminAuthUseCase.register(value);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const result = await this.adminAuthUseCase.login(value.email, value.password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = AdminAuthController;