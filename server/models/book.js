import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title:{type:String, required:true},
    author:{type:String, required:true},
    description:String,
    isbn: String,
    publicationDate: Date,
    price: Number,
    genre: {type: Schema.ObjectId, ref: 'Genre'},
});

const Book = mongoose.model('Book',bookSchema);
export default Book;