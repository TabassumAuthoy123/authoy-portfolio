const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error(err));

async function seedAdmin() {
  try {
    // Check if an admin already exists
    let admin = await Admin.findOne();
    if (admin) {
      console.log('Admin user found, updating to email: adnankmitul@gmail.com');
      // If we just swap the username for email forcefully
      await Admin.collection.updateOne({ _id: admin._id }, { $set: { email: 'adnankmitul@gmail.com' }, $unset: { username: "" } });
      console.log('Admin document updated successfully.');
    } else {
      console.log('No admin found, creating a new one...');
      admin = new Admin({
        email: 'adnankmitul@gmail.com',
        password: 'admin' // temporary password, user should change it or reset it
      });
      await admin.save();
      console.log('New admin created with email: adnankmitul@gmail.com');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    process.exit();
  }
}

seedAdmin();
