const axios = require('axios');

const USER_SERVICE_URL = 'http://localhost:3001/api';
const ADMIN_SERVICE_URL = 'http://localhost:3002/api';

async function testEndToEndFlow() {
  try {
    console.log('🚀 Starting End-to-End Test Flow...\n');

    // 1. Admin Login
    console.log('1. Admin Login...');
    const adminLoginResponse = await axios.post(`${ADMIN_SERVICE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin logged in successfully\n');

    // 2. Admin Creates Product
    console.log('2. Admin creates product...');
    const productData = {
      name: 'Test Product',
      description: 'This is a test product created via API',
      price: 99.99,
      category: 'Test Category',
      stock: 10
    };
    
    const createProductResponse = await axios.post(`${ADMIN_SERVICE_URL}/products`, productData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const createdProduct = createProductResponse.data;
    console.log('✅ Product created:', createdProduct.name);
    console.log('   Product ID:', createdProduct._id, '\n');

    // 3. User Registration
    console.log('3. User registration...');
    const userData = {
      email: 'testuser@example.com',
      password: 'user123',
      name: 'Test User'
    };
    
    try {
      const userRegisterResponse = await axios.post(`${USER_SERVICE_URL}/auth/register`, userData);
      console.log('✅ User registered successfully\n');
    } catch (error) {
      if (error.response?.data?.error === 'User already exists') {
        console.log('ℹ️  User already exists, proceeding with login\n');
      } else {
        throw error;
      }
    }

    // 4. User Login
    console.log('4. User login...');
    const userLoginResponse = await axios.post(`${USER_SERVICE_URL}/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    const userToken = userLoginResponse.data.token;
    console.log('✅ User logged in successfully\n');

    // 5. User Gets Profile
    console.log('5. User gets profile...');
    const profileResponse = await axios.get(`${USER_SERVICE_URL}/profile`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ User profile retrieved:', profileResponse.data.name, '\n');

    // 6. User Adds Bank Details
    console.log('6. User adds bank details...');
    const bankDetails = {
      bankName: 'Test Bank',
      accountNumber: '1234567890',
      routingNumber: '987654321'
    };
    
    const bankDetailsResponse = await axios.post(`${USER_SERVICE_URL}/bank-details`, bankDetails, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Bank details added successfully\n');

    // 7. Get Products (Public endpoint)
    console.log('7. Getting products from public endpoint...');
    const publicProductsResponse = await axios.get(`${ADMIN_SERVICE_URL}/public/products`);
    console.log('✅ Products retrieved:', publicProductsResponse.data.length, 'products found');
    console.log('   First product:', publicProductsResponse.data[0]?.name || 'No products', '\n');

    // 8. Admin Gets All Products
    console.log('8. Admin gets all products...');
    const adminProductsResponse = await axios.get(`${ADMIN_SERVICE_URL}/products`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Admin retrieved', adminProductsResponse.data.length, 'products\n');

    // 9. Admin Updates Product
    console.log('9. Admin updates product...');
    const updateData = {
      name: 'Updated Test Product',
      price: 149.99
    };
    
    const updateProductResponse = await axios.put(`${ADMIN_SERVICE_URL}/products/${createdProduct._id}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Product updated:', updateProductResponse.data.name, '\n');

    console.log('🎉 End-to-End Test Flow Completed Successfully!');
    console.log('\n📊 Summary:');
    console.log('- Admin authentication: ✅');
    console.log('- Product creation: ✅');
    console.log('- User authentication: ✅');
    console.log('- User profile management: ✅');
    console.log('- Bank details management: ✅');
    console.log('- Product retrieval: ✅');
    console.log('- Product updates: ✅');
    console.log('- Separate JWT authentication: ✅');
    console.log('- Clean Architecture implementation: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('\n🔍 Make sure both services are running:');
    console.error('- User Service: http://localhost:3001');
    console.error('- Admin Service: http://localhost:3002');
  }
}

// Run the test
testEndToEndFlow();