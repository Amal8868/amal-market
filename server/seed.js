const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

const categoriesData = [
  { name: 'Fresh Fruits', description: 'Sweet, juicy, and packed with vitamins.', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=800', color: '#ff6b6b' },
  { name: 'Vegetables', description: 'Crisp, garden-fresh greens and seasonal favorites.', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800', color: '#51cf66' },
  { name: 'Bakery', description: 'Artisanal breads, flaky pastries, and morning treats.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800', color: '#ff922b' },
  { name: 'Dairy & Eggs', description: 'Pure, wholesome dairy and farm-fresh eggs.', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=800', color: '#74c0fc' },
  { name: 'Meat & Seafood', description: 'Premium cuts and sustainably sourced seafood.', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800', color: '#e64980' },
  { name: 'Organic Specials', description: 'Certified organic products for a healthier lifestyle.', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=800', color: '#69db7c' },
  { name: 'Beverages', description: 'Refreshing juices, artisanal coffees, and organic teas.', image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=800', color: '#4dabf7' },
  { name: 'Frozen Foods', description: 'Quality frozen meals preserved at peak freshness.', image: 'https://images.unsplash.com/photo-1464195244916-405fa0a82545?q=80&w=800', color: '#be4bdb' },
];

const productsData = [
  { name: 'Organic Avocado', cat: 'Fresh Fruits', price: 3.50, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=600', badge: 'Best Seller' },
  { name: 'Red Fuji Apple', cat: 'Fresh Fruits', price: 1.20, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600' },
  { name: 'Golden Pineapple', cat: 'Fresh Fruits', price: 4.90, image: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?q=80&w=600' },
  { name: 'Organic Blueberries', cat: 'Fresh Fruits', price: 5.50, image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=600', badge: 'Best Seller' },
  { name: 'Seedless Grapes', cat: 'Fresh Fruits', price: 3.90, image: 'https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?q=80&w=600' },
  { name: 'Sweet Mango', cat: 'Fresh Fruits', price: 2.50, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600' },
  { name: 'Navel Oranges', cat: 'Fresh Fruits', price: 1.80, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=600' },
  { name: 'Cavendish Bananas', cat: 'Fresh Fruits', price: 0.80, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=600', badge: 'Organic', isOrganic: true },
  { name: 'Anjou Pears', cat: 'Fresh Fruits', price: 2.20, image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=600' },
  { name: 'Organic Kiwi', cat: 'Fresh Fruits', price: 3.80, image: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=600', isOrganic: true },
  { name: 'Watermelon Slices', cat: 'Fresh Fruits', price: 5.50, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600' },
  { name: 'Pomegranate', cat: 'Fresh Fruits', price: 3.90, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600' },
  { name: 'Fresh Broccoli', cat: 'Vegetables', price: 2.80, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=600', badge: 'Organic', isOrganic: true },
  { name: 'Organic Carrots', cat: 'Vegetables', price: 2.50, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600', badge: 'Organic', isOrganic: true },
  { name: 'Cherry Tomatoes', cat: 'Vegetables', price: 3.20, image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=600' },
  { name: 'Bell Peppers Mix', cat: 'Vegetables', price: 4.50, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=600' },
  { name: 'Fresh Spinach', cat: 'Vegetables', price: 2.20, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600', badge: 'Organic', isOrganic: true },
  { name: 'Asparagus Bundles', cat: 'Vegetables', price: 5.40, image: 'https://images.unsplash.com/photo-1588615419955-52347b593a2e?q=80&w=600', badge: 'Gourmet' },
  { name: 'Sweet Corn', cat: 'Vegetables', price: 3.00, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=600' },
  { name: 'Red Onions', cat: 'Vegetables', price: 1.50, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=600' },
  { name: 'Russet Potatoes', cat: 'Vegetables', price: 4.80, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600' },
  { name: 'Cauliflower', cat: 'Vegetables', price: 3.50, image: 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?q=80&w=600' },
  { name: 'Zucchini', cat: 'Vegetables', price: 1.90, image: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?q=80&w=600' },
  { name: 'Red Cabbage', cat: 'Vegetables', price: 2.40, image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=600' },
  { name: 'Sourdough Bread', cat: 'Bakery', price: 5.90, image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=600', badge: 'New' },
  { name: 'Butter Croissants', cat: 'Bakery', price: 4.50, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600', badge: 'Freshly Baked' },
  { name: 'Artisan Baguette', cat: 'Bakery', price: 3.20, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600' },
  { name: 'Whole Wheat Bread', cat: 'Bakery', price: 4.20, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600', badge: 'Healthy' },
  { name: 'Chocolate Muffins', cat: 'Bakery', price: 6.50, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=600' },
  { name: 'Sesame Bagels', cat: 'Bakery', price: 5.20, image: 'https://images.unsplash.com/photo-1585478259715-876a6a81fc08?q=80&w=600' },
  { name: 'Focaccia Bread', cat: 'Bakery', price: 7.50, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=600', badge: 'Artisan' },
  { name: 'Cinnamon Rolls', cat: 'Bakery', price: 8.40, image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=600', badge: 'Best Seller' },
  { name: 'Farm Fresh Eggs', cat: 'Dairy & Eggs', price: 4.20, image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=600', badge: 'Sale' },
  { name: 'Whole Milk', cat: 'Dairy & Eggs', price: 3.80, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600' },
  { name: 'Greek Yogurt', cat: 'Dairy & Eggs', price: 5.40, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600' },
  { name: 'Cheddar Cheese', cat: 'Dairy & Eggs', price: 8.90, image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=600', badge: 'Premium' },
  { name: 'Butter Salted', cat: 'Dairy & Eggs', price: 6.20, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=600' },
  { name: 'Mozzarella Ball', cat: 'Dairy & Eggs', price: 7.50, image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?q=80&w=600', badge: 'Italian' },
  { name: 'Almond Milk', cat: 'Dairy & Eggs', price: 4.80, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600', badge: 'Vegan' },
  { name: 'Premium Ribeye', cat: 'Meat & Seafood', price: 24.00, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?q=80&w=600', badge: 'Premium' },
  { name: 'Atlantic Salmon', cat: 'Meat & Seafood', price: 18.50, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600', badge: 'New' },
  { name: 'Organic Chicken Breast', cat: 'Meat & Seafood', price: 12.90, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=600', badge: 'Organic', isOrganic: true },
  { name: 'Ground Beef 90/10', cat: 'Meat & Seafood', price: 9.50, image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=600' },
  { name: 'Lamb Chops', cat: 'Meat & Seafood', price: 28.00, image: 'https://images.unsplash.com/photo-1602491673980-73aa38de027a?q=80&w=600', badge: 'Premium' },
  { name: 'Large Shrimp', cat: 'Meat & Seafood', price: 16.00, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=600' },
  { name: 'Bacon Applewood', cat: 'Meat & Seafood', price: 8.20, image: 'https://images.unsplash.com/photo-1606850780554-b55ea4dd0b70?q=80&w=600', badge: 'Best Seller' },
  { name: 'Orange Juice', cat: 'Beverages', price: 4.50, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=600', badge: 'Best Seller' },
  { name: 'Cold Brew Coffee', cat: 'Beverages', price: 6.00, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600', badge: 'Artisanal' },
  { name: 'Green Matcha Tea', cat: 'Beverages', price: 14.00, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600' },
  { name: 'Sparkling Water', cat: 'Beverages', price: 2.50, image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?q=80&w=600' },
  { name: 'Coconut Water', cat: 'Beverages', price: 4.20, image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?q=80&w=600', badge: 'Natural' },
  { name: 'Kombucha Ginger', cat: 'Beverages', price: 5.80, image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=600', badge: 'Probiotic' },
  { name: 'Raw Manuka Honey', cat: 'Organic Specials', price: 32.00, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=600', badge: 'Luxury', isOrganic: true },
  { name: 'Organic Quinoa', cat: 'Organic Specials', price: 8.50, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600', isOrganic: true },
  { name: 'Chia Seeds 1lb', cat: 'Organic Specials', price: 12.00, image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=600', isOrganic: true },
  { name: 'Virgin Coconut Oil', cat: 'Organic Specials', price: 16.50, image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600', isOrganic: true },
  { name: 'Himalayan Salt', cat: 'Organic Specials', price: 5.00, image: 'https://images.unsplash.com/photo-1596871435186-19b3d5fb5a18?q=80&w=600' },
  { name: 'Acai Powder', cat: 'Organic Specials', price: 24.00, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=600', badge: 'Superfood', isOrganic: true },
  { name: 'Frozen Berry Mix', cat: 'Frozen Foods', price: 8.50, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=600' },
  { name: 'Organic Frozen Peas', cat: 'Frozen Foods', price: 4.20, image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?q=80&w=600', isOrganic: true },
  { name: 'Cauliflower Pizza', cat: 'Frozen Foods', price: 12.50, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600', badge: 'Low Carb' },
  { name: 'Veggie Spring Rolls', cat: 'Frozen Foods', price: 9.00, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600' },
  { name: 'Spinach Lasagna', cat: 'Frozen Foods', price: 13.50, image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=600', badge: 'Family Size' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing data');

    // Create Admin User & Demo User
    const adminUser = await User.create({
      name: 'Amal Admin',
      email: 'admin@amalmarket.com',
      password: 'admin123',
      phone: '+252 61 9998877',
      address: 'Maka Al-Mukarama Road, Km4, Mogadishu',
      role: 'admin'
    });

    const demoUser = await User.create({
      name: 'Amina Warsame',
      email: 'demo@amalmarket.com',
      password: 'demo123',
      phone: '+252 61 5550192',
      address: 'Wadajir, Suuqa Weyn, Mogadishu',
      role: 'user'
    });
    console.log('Created Admin (admin@amalmarket.com) & Demo user (demo@amalmarket.com)');

    // Insert categories with explicit slugs
    const categoriesWithSlugs = categoriesData.map(c => ({
      ...c,
      slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));
    const createdCategories = await Category.insertMany(categoriesWithSlugs);
    console.log(`Inserted ${createdCategories.length} categories`);

    // Build category name → _id map
    const catMap = {};
    createdCategories.forEach(c => { catMap[c.name] = c._id; });

    // Insert products with category references
    const productsWithRefs = productsData.map(p => ({
      name: p.name,
      description: `Premium quality ${p.name.toLowerCase()} sourced from sustainable farms. Freshness guaranteed.`,
      price: p.price,
      category: catMap[p.cat],
      categoryName: p.cat,
      image: p.image,
      images: [p.image],
      stock: p.badge === 'Best Seller' ? 150 : (p.name.includes('Milk') || p.name.includes('Eggs') || p.name.includes('Apple')) ? 100 : 50,
      rating: parseFloat((Math.random() * (5.0 - 4.5) + 4.5).toFixed(1)),
      numReviews: Math.floor(Math.random() * 120) + 15,
      badge: p.badge || '',
      isOrganic: p.isOrganic || false,
    }));


    const createdProducts = await Product.insertMany(productsWithRefs);
    console.log(`Inserted ${createdProducts.length} products`);

    // Create 3 sample orders for demo
    await Order.create([
      {
        user: demoUser._id,
        orderItems: [
          { product: createdProducts[0]._id, name: createdProducts[0].name, image: createdProducts[0].image, price: createdProducts[0].price, quantity: 2 },
          { product: createdProducts[3]._id, name: createdProducts[3].name, image: createdProducts[3].image, price: createdProducts[3].price, quantity: 1 }
        ],
        shippingAddress: { fullName: 'Amina Warsame', address: 'Wadajir, Suuqa Weyn', city: 'Mogadishu', postalCode: '00252', country: 'Somalia', phone: '+252 61 5550192' },
        paymentMethod: 'credit_card',
        payment: { provider: 'mock', status: 'succeeded', reference: 'MOCK-SEED-001' },
        itemsPrice: 12.50,
        taxPrice: 0.63,
        shippingPrice: 0,
        totalPrice: 13.13,
        isPaid: true,
        paidAt: new Date(),
        status: 'processing'
      },
      {
        user: demoUser._id,
        orderItems: [
          { product: createdProducts[12]._id, name: createdProducts[12].name, image: createdProducts[12].image, price: createdProducts[12].price, quantity: 3 }
        ],
        shippingAddress: { fullName: 'Farah Shirwa', address: 'Hodan, Taleex Road', city: 'Mogadishu', postalCode: '00252', country: 'Somalia', phone: '+252 61 3344556' },
        paymentMethod: 'evc_plus',
        payment: { provider: 'mock', status: 'succeeded', reference: 'MOCK-SEED-002' },
        itemsPrice: 8.40,
        taxPrice: 0.42,
        shippingPrice: 0,
        totalPrice: 8.82,
        isPaid: true,
        paidAt: new Date(),
        status: 'shipped'
      },
      {
        user: demoUser._id,
        orderItems: [
          { product: createdProducts[20]._id, name: createdProducts[20].name, image: createdProducts[20].image, price: createdProducts[20].price, quantity: 5 }
        ],
        shippingAddress: { fullName: 'Halima Roble', address: 'Bakaara Market, Ave 1', city: 'Mogadishu', postalCode: '00252', country: 'Somalia', phone: '+252 61 7776655' },
        paymentMethod: 'evc_plus',
        payment: { provider: 'mock', status: 'succeeded', reference: 'MOCK-SEED-003' },
        itemsPrice: 24.00,
        taxPrice: 1.20,
        shippingPrice: 0,
        totalPrice: 25.20,
        isPaid: true,
        paidAt: new Date(),
        status: 'delivered',
        deliveredAt: new Date()
      }
    ]);
    console.log('Inserted 3 sample customer orders');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();
