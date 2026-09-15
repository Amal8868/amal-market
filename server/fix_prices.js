const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
mongoose.connect(process.env.MONGODB_URI);

const ProductSchema = new mongoose.Schema({
  oldPrice: Number,
  price: Number
}, { strict: false });
const Product = mongoose.model('Product', ProductSchema);

const fixPrices = async () => {
  try {
    await Product.updateMany({}, { $unset: { oldPrice: "" } });
    console.log('Successfully removed all fake oldPrices');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixPrices();
