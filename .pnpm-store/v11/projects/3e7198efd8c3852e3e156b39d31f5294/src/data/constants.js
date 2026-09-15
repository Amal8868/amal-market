import { Truck, Shield, Leaf, Clock } from 'lucide-react';

/* ─── Categories ─── */
export const categories = [
  { name: 'Fresh Fruits', count: '120+ items', img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=600', color: '#ff6b6b', desc: 'Sweet, juicy, and packed with vitamins. Directly from local orchards.' },
  { name: 'Vegetables', count: '95+ items', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600', color: '#51cf66', desc: 'Crisp, garden-fresh greens and seasonal favorites for your daily meals.' },
  { name: 'Bakery', count: '60+ items', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600', color: '#ff922b', desc: 'Artisanal breads, flaky pastries, and morning treats baked daily.' },
  { name: 'Dairy & Eggs', count: '45+ items', img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=600', color: '#74c0fc', desc: 'Pure, wholesome dairy and farm-fresh eggs from grass-fed cows.' },
  { name: 'Meat & Seafood', count: '55+ items', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=600', color: '#e64980', desc: 'Premium cuts and sustainably sourced seafood for gourmet dinners.' },
  { name: 'Organic Specials', count: '80+ items', img: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=600', color: '#69db7c', desc: 'Certified organic products for a healthier, sustainable lifestyle.' },
  { name: 'Beverages', count: '70+ items', img: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=600', color: '#4dabf7', desc: 'Refreshing juices, artisanal coffees, and organic tea selections.' },
  { name: 'Frozen Foods', count: '40+ items', img: 'https://images.unsplash.com/photo-1464195244916-405fa0a82545?q=80&w=600', color: '#be4bdb', desc: 'Quality frozen meals and ingredients preserved at peak freshness.' },
];

/* ─── Category name list (for filters) ─── */
export const categoryNames = ['All', ...categories.map(c => c.name)];

/* ─── Featured Products (homepage) ─── */
export const featuredProducts = [
  { id: 1, name: 'Organic Avocado', cat: 'Fresh Fruits', price: 3.50, oldPrice: 4.20, img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=600', rating: 4.9, badge: 'Best Seller' },
  { id: 2, name: 'Fresh Broccoli', cat: 'Vegetables', price: 2.80, oldPrice: 3.50, img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=600', rating: 4.8, badge: 'Organic' },
  { id: 3, name: 'Sourdough Bread', cat: 'Bakery', price: 5.90, oldPrice: 7.00, img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600', rating: 5.0, badge: 'New' },
  { id: 4, name: 'Farm Fresh Eggs', cat: 'Dairy & Eggs', price: 4.20, oldPrice: 5.00, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600', rating: 4.7, badge: 'Sale' },
  { id: 8, name: 'Premium Ribeye', cat: 'Meat & Seafood', price: 24.00, oldPrice: 28.00, img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?q=80&w=600', rating: 4.8, badge: 'Premium' },
  { id: 12, name: 'Organic Blueberries', cat: 'Fresh Fruits', price: 5.50, oldPrice: 6.50, img: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=600', rating: 4.9, badge: 'Best Seller' },
];

/* ─── Trust Features ─── */
export const features = [
  { icon: Truck, title: 'Same-Day Delivery', desc: 'Fresh to your door in under 2 hours' },
  { icon: Shield, title: 'Quality Guaranteed', desc: '100% satisfaction or money back' },
  { icon: Leaf, title: '100% Organic', desc: 'Certified organic from local farms' },
  { icon: Clock, title: 'Open 24/7', desc: 'Order anytime, delivered on schedule' },
];

/* ─── Customer Reviews ─── */
export const reviews = [
  { name: 'Sarah Jenkins', role: 'Health Coach', text: 'Amal Market has completely transformed how my family eats. The produce is always crisp and incredibly fresh.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150' },
  { name: 'Michael Chen', role: 'Home Chef', text: 'The quality of the organic vegetables is unmatched. As a chef, I appreciate the artisanal selection.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150' },
  { name: 'Elena Rodriguez', role: 'Mother of 3', text: 'Clean eating for my family is now affordable and convenient. Amal Market makes it easy.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150' },
];

/* ─── Fallback Products (Single Source of Truth) ─── */
export const fallbackProducts = [
  // Fresh Fruits (12)
  { id: 1, name: 'Organic Avocado', cat: 'Fresh Fruits', price: 3.50, oldPrice: 4.20, img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=600', rating: 4.9, reviews: 128, badge: 'Best Seller' },
  { id: 5, name: 'Red Fuji Apple', cat: 'Fresh Fruits', price: 1.20, oldPrice: 1.50, img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600', rating: 4.6, reviews: 56, badge: '' },
  { id: 11, name: 'Golden Pineapple', cat: 'Fresh Fruits', price: 4.90, oldPrice: 5.50, img: 'https://images.unsplash.com/photo-1550258114-b0d2475b5394?q=80&w=600', rating: 4.8, reviews: 45, badge: '' },
  { id: 12, name: 'Organic Blueberries', cat: 'Fresh Fruits', price: 5.50, oldPrice: 6.50, img: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=600', rating: 4.9, reviews: 167, badge: 'Best Seller' },
  { id: 13, name: 'Seedless Grapes', cat: 'Fresh Fruits', price: 3.90, oldPrice: 4.50, img: 'https://images.unsplash.com/photo-1537640538966-79f369b41e8f?q=80&w=600', rating: 4.7, reviews: 89, badge: '' },
  { id: 25, name: 'Sweet Mango', cat: 'Fresh Fruits', price: 2.50, oldPrice: 3.20, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600', rating: 4.8, reviews: 112, badge: '' },
  { id: 26, name: 'Navel Oranges', cat: 'Fresh Fruits', price: 1.80, oldPrice: 2.20, img: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=600', rating: 4.6, reviews: 74, badge: '' },
  { id: 27, name: 'Cavendish Bananas', cat: 'Fresh Fruits', price: 0.80, oldPrice: 1.10, img: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=600', rating: 4.9, reviews: 245, badge: 'Organic' },
  { id: 28, name: 'Anjou Pears', cat: 'Fresh Fruits', price: 2.20, oldPrice: 2.80, img: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=600', rating: 4.7, reviews: 53, badge: '' },
  { id: 29, name: 'Organic Kiwi', cat: 'Fresh Fruits', price: 3.80, oldPrice: 4.50, img: 'https://images.unsplash.com/photo-1585059895524-72359e061381?q=80&w=600', rating: 4.8, reviews: 62, badge: '' },
  { id: 81, name: 'Watermelon Slices', cat: 'Fresh Fruits', price: 5.50, oldPrice: 6.80, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600', rating: 4.7, reviews: 88, badge: '' },
  { id: 82, name: 'Pomegranate', cat: 'Fresh Fruits', price: 3.90, oldPrice: 4.50, img: 'https://images.unsplash.com/photo-1531390658120-e06994939063?q=80&w=600', rating: 4.9, reviews: 42, badge: '' },

  // Vegetables (12)
  { id: 2, name: 'Fresh Broccoli', cat: 'Vegetables', price: 2.80, oldPrice: 3.50, img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=600', rating: 4.8, reviews: 85, badge: 'Organic' },
  { id: 6, name: 'Organic Carrots', cat: 'Vegetables', price: 2.50, oldPrice: 3.00, img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600', rating: 4.9, reviews: 94, badge: 'Organic' },
  { id: 14, name: 'Cherry Tomatoes', cat: 'Vegetables', price: 3.20, oldPrice: 4.00, img: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=600', rating: 4.8, reviews: 112, badge: '' },
  { id: 15, name: 'Bell Peppers Mix', cat: 'Vegetables', price: 4.50, oldPrice: 5.20, img: 'https://images.unsplash.com/photo-1566275529824-cca6d00a430b?q=80&w=600', rating: 4.7, reviews: 64, badge: '' },
  { id: 16, name: 'Fresh Spinach', cat: 'Vegetables', price: 2.20, oldPrice: 2.80, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600', rating: 4.9, reviews: 143, badge: 'Organic' },
  { id: 30, name: 'Asparagus Bundles', cat: 'Vegetables', price: 5.40, oldPrice: 6.50, img: 'https://images.unsplash.com/photo-1515471204579-2ba07743607f?q=80&w=600', rating: 4.8, reviews: 39, badge: 'Gourmet' },
  { id: 31, name: 'Sweet Corn', cat: 'Vegetables', price: 3.00, oldPrice: 4.00, img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=600', rating: 4.7, reviews: 82, badge: '' },
  { id: 32, name: 'Red Onions', cat: 'Vegetables', price: 1.50, oldPrice: 2.00, img: 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=600', rating: 4.6, reviews: 156, badge: '' },
  { id: 33, name: 'Russet Potatoes', cat: 'Vegetables', price: 4.80, oldPrice: 6.00, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600', rating: 4.7, reviews: 128, badge: '' },
  { id: 34, name: 'Cauliflower', cat: 'Vegetables', price: 3.50, oldPrice: 4.50, img: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ec3?q=80&w=600', rating: 4.8, reviews: 67, badge: '' },
  { id: 83, name: 'Zucchini', cat: 'Vegetables', price: 1.90, oldPrice: 2.50, img: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?q=80&w=600', rating: 4.7, reviews: 54, badge: '' },
  { id: 84, name: 'Red Cabbage', cat: 'Vegetables', price: 2.40, oldPrice: 3.20, img: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=600', rating: 4.6, reviews: 31, badge: '' },

  // Bakery (10)
  { id: 3, name: 'Sourdough Bread', cat: 'Bakery', price: 5.90, oldPrice: 7.00, img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600', rating: 5.0, reviews: 42, badge: 'New' },
  { id: 17, name: 'Butter Croissants', cat: 'Bakery', price: 4.50, oldPrice: 5.20, img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600', rating: 4.8, reviews: 92, badge: 'Freshly Baked' },
  { id: 18, name: 'Artisan Baguette', cat: 'Bakery', price: 3.20, oldPrice: 3.80, img: 'https://images.unsplash.com/photo-1586444248902-2f64eddf13cf?q=80&w=600', rating: 4.7, reviews: 58, badge: '' },
  { id: 35, name: 'Whole Wheat Bread', cat: 'Bakery', price: 4.20, oldPrice: 5.00, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600', rating: 4.8, reviews: 110, badge: 'Healthy' },
  { id: 36, name: 'Chocolate Muffins', cat: 'Bakery', price: 6.50, oldPrice: 8.00, img: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=600', rating: 4.9, reviews: 73, badge: '' },
  { id: 37, name: 'Sesame Bagels', cat: 'Bakery', price: 5.20, oldPrice: 6.50, img: 'https://images.unsplash.com/photo-1515823662273-0b78805881db?q=80&w=600', rating: 4.7, reviews: 45, badge: '' },
  { id: 38, name: 'Blueberry Danish', cat: 'Bakery', price: 3.90, oldPrice: 4.80, img: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=600', rating: 4.8, reviews: 31, badge: '' },
  { id: 39, name: 'Focaccia Bread', cat: 'Bakery', price: 7.50, oldPrice: 9.00, img: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=600', rating: 4.9, reviews: 26, badge: 'Artisan' },
  { id: 40, name: 'Cinnamon Rolls', cat: 'Bakery', price: 8.40, oldPrice: 10.50, img: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=600', rating: 5.0, reviews: 88, badge: 'Best Seller' },
  { id: 41, name: 'Pretzels Soft', cat: 'Bakery', price: 3.50, oldPrice: 4.50, img: 'https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?q=80&w=600', rating: 4.7, reviews: 54, badge: '' },

  // Dairy & Eggs (10)
  { id: 4, name: 'Farm Fresh Eggs', cat: 'Dairy & Eggs', price: 4.20, oldPrice: 5.00, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600', rating: 4.7, reviews: 210, badge: 'Sale' },
  { id: 7, name: 'Whole Milk', cat: 'Dairy & Eggs', price: 3.80, oldPrice: 4.50, img: 'https://images.unsplash.com/photo-1563636619-e9107da4a1bb?q=80&w=600', rating: 4.5, reviews: 112, badge: '' },
  { id: 19, name: 'Greek Yogurt', cat: 'Dairy & Eggs', price: 5.40, oldPrice: 6.20, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600', rating: 4.8, reviews: 76, badge: '' },
  { id: 42, name: 'Cheddar Cheese', cat: 'Dairy & Eggs', price: 8.90, oldPrice: 10.50, img: 'https://images.unsplash.com/photo-1486297678162-ad2a19b058f1?q=80&w=600', rating: 4.9, reviews: 134, badge: 'Premium' },
  { id: 43, name: 'Butter Salted', cat: 'Dairy & Eggs', price: 6.20, oldPrice: 7.50, img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=600', rating: 4.8, reviews: 65, badge: '' },
  { id: 44, name: 'Mozzarella Ball', cat: 'Dairy & Eggs', price: 7.50, oldPrice: 9.00, img: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?q=80&w=600', rating: 4.9, reviews: 42, badge: 'Italian' },
  { id: 45, name: 'Almond Milk', cat: 'Dairy & Eggs', price: 4.80, oldPrice: 5.80, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600', rating: 4.7, reviews: 98, badge: 'Vegan' },
  { id: 46, name: 'Heavy Cream', cat: 'Dairy & Eggs', price: 3.50, oldPrice: 4.20, img: 'https://images.unsplash.com/photo-1563636619-e9107da4a1bb?q=80&w=600', rating: 4.6, reviews: 51, badge: '' },
  { id: 47, name: 'Free-Range Duck Eggs', cat: 'Dairy & Eggs', price: 9.00, oldPrice: 11.50, img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=600', rating: 5.0, reviews: 18, badge: 'Rare' },
  { id: 48, name: 'Oat Milk Creamer', cat: 'Dairy & Eggs', price: 5.20, oldPrice: 6.00, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600', rating: 4.8, reviews: 76, badge: '' },

  // Meat & Seafood (10)
  { id: 8, name: 'Premium Ribeye', cat: 'Meat & Seafood', price: 24.00, oldPrice: 28.00, img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?q=80&w=600', rating: 4.8, reviews: 34, badge: 'Premium' },
  { id: 10, name: 'Atlantic Salmon', cat: 'Meat & Seafood', price: 18.50, oldPrice: 22.00, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600', rating: 4.9, reviews: 51, badge: 'New' },
  { id: 20, name: 'Organic Chicken Breast', cat: 'Meat & Seafood', price: 12.90, oldPrice: 15.00, img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=600', rating: 4.7, reviews: 88, badge: 'Organic' },
  { id: 49, name: 'Ground Beef 90/10', cat: 'Meat & Seafood', price: 9.50, oldPrice: 11.00, img: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=600', rating: 4.8, reviews: 142, badge: '' },
  { id: 50, name: 'Lamb Chops', cat: 'Meat & Seafood', price: 28.00, oldPrice: 34.00, img: 'https://images.unsplash.com/photo-1602491673980-73aa38de027a?q=80&w=600', rating: 5.0, reviews: 25, badge: 'Premium' },
  { id: 51, name: 'Large Shrimp', cat: 'Meat & Seafood', price: 16.00, oldPrice: 20.00, img: 'https://images.unsplash.com/photo-1559737558-2f5a34698506?q=80&w=600', rating: 4.7, reviews: 63, badge: '' },
  { id: 52, name: 'Pork Tenderloin', cat: 'Meat & Seafood', price: 14.50, oldPrice: 17.00, img: 'https://images.unsplash.com/photo-1602477667035-edc71cbd267a?q=80&w=600', rating: 4.6, reviews: 49, badge: '' },
  { id: 53, name: 'Bacon Applewood', cat: 'Meat & Seafood', price: 8.20, oldPrice: 10.00, img: 'https://images.unsplash.com/photo-1606850780554-b55ea4dd0b70?q=80&w=600', rating: 4.9, reviews: 176, badge: 'Best Seller' },
  { id: 54, name: 'Cod Fillets', cat: 'Meat & Seafood', price: 13.00, oldPrice: 16.00, img: 'https://images.unsplash.com/photo-1534604973900-c41ab4c5d4b0?q=80&w=600', rating: 4.7, reviews: 38, badge: '' },
  { id: 55, name: 'Wagyu Beef Burger', cat: 'Meat & Seafood', price: 15.00, oldPrice: 18.00, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600', rating: 4.9, reviews: 92, badge: 'Special' },

  // Beverages (10)
  { id: 9, name: 'Orange Juice', cat: 'Beverages', price: 4.50, oldPrice: 5.50, img: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=600', rating: 4.7, reviews: 78, badge: 'Best Seller' },
  { id: 21, name: 'Cold Brew Coffee', cat: 'Beverages', price: 6.00, oldPrice: 7.50, img: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=600', rating: 4.9, reviews: 124, badge: 'Artisanal' },
  { id: 22, name: 'Green Matcha Tea', cat: 'Beverages', price: 14.00, oldPrice: 18.00, img: 'https://images.unsplash.com/photo-1582793988951-9aed55099991?q=80&w=600', rating: 4.8, reviews: 43, badge: '' },
  { id: 56, name: 'Sparkling Water', cat: 'Beverages', price: 2.50, oldPrice: 3.50, img: 'https://images.unsplash.com/photo-1551717316-2a74c43d57b5?q=80&w=600', rating: 4.6, reviews: 189, badge: '' },
  { id: 57, name: 'Coconut Water', cat: 'Beverages', price: 4.20, oldPrice: 5.00, img: 'https://images.unsplash.com/photo-1563212891-383679803027?q=80&w=600', rating: 4.8, reviews: 94, badge: 'Natural' },
  { id: 58, name: 'Kombucha Ginger', cat: 'Beverages', price: 5.80, oldPrice: 7.00, img: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=600', rating: 4.9, reviews: 67, badge: 'Probiotic' },
  { id: 59, name: 'Apple Cider', cat: 'Beverages', price: 7.00, oldPrice: 9.00, img: 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?q=80&w=600', rating: 4.7, reviews: 41, badge: '' },
  { id: 60, name: 'Craft Soda Cane', cat: 'Beverages', price: 3.20, oldPrice: 4.00, img: 'https://images.unsplash.com/photo-1527960669566-f882ba85a4c6?q=80&w=600', rating: 4.5, reviews: 58, badge: '' },
  { id: 61, name: 'Herbal Detox Tea', cat: 'Beverages', price: 12.00, oldPrice: 15.00, img: 'https://images.unsplash.com/photo-1544787210-282744099f1b?q=80&w=600', rating: 4.8, reviews: 34, badge: '' },
  { id: 62, name: 'Pomegranate Juice', cat: 'Beverages', price: 8.50, oldPrice: 11.00, img: 'https://images.unsplash.com/photo-1531390658120-e06994939063?q=80&w=600', rating: 4.9, reviews: 29, badge: 'Antioxidant' },

  // Organic Specials (10)
  { id: 23, name: 'Raw Manuka Honey', cat: 'Organic Specials', price: 32.00, oldPrice: 38.00, img: 'https://images.unsplash.com/photo-1587049352851-8d4e89134292?q=80&w=600', rating: 5.0, reviews: 29, badge: 'Luxury' },
  { id: 24, name: 'Organic Quinoa', cat: 'Organic Specials', price: 8.50, oldPrice: 10.00, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600', rating: 4.7, reviews: 67, badge: '' },
  { id: 63, name: 'Chia Seeds 1lb', cat: 'Organic Specials', price: 12.00, oldPrice: 15.00, img: 'https://images.unsplash.com/photo-1599021456807-25db0f974333?q=80&w=600', rating: 4.8, reviews: 143, badge: '' },
  { id: 64, name: 'Virgin Coconut Oil', cat: 'Organic Specials', price: 16.50, oldPrice: 20.00, img: 'https://images.unsplash.com/photo-1622484211148-716598e04141?q=80&w=600', rating: 4.9, reviews: 88, badge: '' },
  { id: 65, name: 'Himalayan Salt', cat: 'Organic Specials', price: 5.00, oldPrice: 7.00, img: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?q=80&w=600', rating: 4.7, reviews: 112, badge: '' },
  { id: 66, name: 'Raw Almonds 1lb', cat: 'Organic Specials', price: 14.00, oldPrice: 18.00, img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?q=80&w=600', rating: 4.8, reviews: 96, badge: '' },
  { id: 67, name: 'Acai Powder', cat: 'Organic Specials', price: 24.00, oldPrice: 30.00, img: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600', rating: 4.9, reviews: 45, badge: 'Superfood' },
  { id: 68, name: 'Goji Berries', cat: 'Organic Specials', price: 18.00, oldPrice: 22.00, img: 'https://images.unsplash.com/photo-1585437636413-d3a3c898c067?q=80&w=600', rating: 4.7, reviews: 51, badge: '' },
  { id: 69, name: 'Spirulina Tabs', cat: 'Organic Specials', price: 28.00, oldPrice: 35.00, img: 'https://images.unsplash.com/photo-1559466273-d95e72debaf8?q=80&w=600', rating: 4.8, reviews: 37, badge: '' },
  { id: 70, name: 'Turmeric Root', cat: 'Organic Specials', price: 4.50, oldPrice: 6.00, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600', rating: 4.9, reviews: 122, badge: '' },

  // Frozen Foods (10)
  { id: 71, name: 'Frozen Berry Mix', cat: 'Frozen Foods', price: 8.50, oldPrice: 11.00, img: 'https://images.unsplash.com/photo-1464195244916-405fa0a82545?q=80&w=600', rating: 4.8, reviews: 156, badge: '' },
  { id: 72, name: 'Organic Frozen Peas', cat: 'Frozen Foods', price: 4.20, oldPrice: 5.50, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=600', rating: 4.7, reviews: 89, badge: '' },
  { id: 73, name: 'Frozen Salmon Burger', cat: 'Frozen Foods', price: 14.00, oldPrice: 18.00, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600', rating: 4.9, reviews: 67, badge: '' },
  { id: 74, name: 'Cauliflower Pizza', cat: 'Frozen Foods', price: 12.50, oldPrice: 15.00, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600', rating: 4.8, reviews: 134, badge: 'Low Carb' },
  { id: 75, name: 'Frozen Mango Chunks', cat: 'Frozen Foods', price: 7.20, oldPrice: 9.00, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600', rating: 4.7, reviews: 56, badge: '' },
  { id: 76, name: 'Veggie Spring Rolls', cat: 'Frozen Foods', price: 9.00, oldPrice: 12.00, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600', rating: 4.9, reviews: 92, badge: '' },
  { id: 77, name: 'Frozen Acai Pack', cat: 'Frozen Foods', price: 15.00, oldPrice: 20.00, img: 'https://images.unsplash.com/photo-1590005354167-6da97870c747?q=80&w=600', rating: 4.8, reviews: 43, badge: '' },
  { id: 78, name: 'Edamame Shelled', cat: 'Frozen Foods', price: 5.50, oldPrice: 7.00, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=600', rating: 4.7, reviews: 78, badge: '' },
  { id: 79, name: 'Frozen Ravioli', cat: 'Frozen Foods', price: 11.00, oldPrice: 14.00, img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=600', rating: 4.8, reviews: 65, badge: 'Artisanal' },
  { id: 80, name: 'Spinach Lasagna', cat: 'Frozen Foods', price: 13.50, oldPrice: 17.00, img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=600', rating: 4.9, reviews: 110, badge: 'Family Size' },
];

