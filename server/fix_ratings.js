const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGODB_URI);

const ProductSchema = new mongoose.Schema({
  rating: Number,
  numReviews: Number
}, { strict: false });

const Product = mongoose.model('Product', ProductSchema);

const fixRatings = async () => {
  try {
    await Product.updateMany({}, { $set: { rating: 0, numReviews: 0 } });
    console.log('Successfully reset all ratings to 0');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixRatings();
