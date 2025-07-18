const Product = require('../entities/Product');

class ProductRepository {
  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async findAll() {
    return await Product.find({ isActive: true });
  }

  async findById(id) {
    return await Product.findById(id);
  }

  async update(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}

module.exports = ProductRepository;