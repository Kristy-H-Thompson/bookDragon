import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booksearch', {
// Remove deprecated options
// useNewUrlParser: true,
// useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});
export default db;
