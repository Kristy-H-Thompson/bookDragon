import { Schema, model } from 'mongoose';
// Define the schema
const bookSchema = new Schema({
    authors: [
        {
            type: String,
        },
    ],
    description: {
        type: String,
        required: true,
    },
    // saved book id from GoogleBooks
    bookId: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    link: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
});
// Define and export the model
const Book = model('Book', bookSchema);
export default Book;
