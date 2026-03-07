const mongoose = require('mongoose');
const uri = "mongodb+srv://admin:admin123@cluster0.ib5tdv.mongodb.net/portfolio?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to DB successfully');
    try {
      const adminCollection = mongoose.connection.collection('admins');
      
      const count = await adminCollection.countDocuments();
      console.log('Total admins found:', count);

      if (count > 0) {
        await adminCollection.updateMany({}, { 
          $set: { email: 'adnankmitul@gmail.com' },
          $unset: { username: "" } 
        });
        console.log('Forcefully updated email for admins');
      } else {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('admin', salt);
        await adminCollection.insertOne({
          email: 'adnankmitul@gmail.com',
          password: password,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('Created new admin with email');
      }
    } catch (err) {
      console.error('Execution Error:', err);
    } finally {
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });
