import BookModel from '../models/book';
import express from 'express';
import GenreModel from './../models/genre';
const router = express.Router();

router.get('/',(req,res) => {
    let urlQuery = req.query.title;
    let schema = urlQuery ? {"title" : {$regex : ".*"+urlQuery.toLowerCase()+".*"}} :{};
    BookModel.find(schema , '-__v').populate('genre', 'name -_id').exec((err, docs) => {
        if(err){
            console.log("error fetching history data: " +err.message);
        }
        console.log(docs.length);
        res.send(docs);
    })
  })

router.post('/', (req,res) =>{
    let book = req.body;
    GenreModel.findOne({name:book.genre},(err,genre) =>{
        book.genre = genre;
        BookModel.findOneAndUpdate({isbn : book.isbn}, book,
            //add if doesn't exist
            {upsert: true}, (err, row) => {

                if(err){
                    console.log('post error book ' + book);

                    res.status(400).render("bad request, book object is not valid");
                }
                res.status(204).send();
            })
    })



})
router.delete('/:id', (req,res) =>{
    let id = req.params.id;
    BookModel.findByIdAndRemove(id,(err, book) => {
        if(err){
            let response = {
                message: "book wasn't deleted",
                id: book._id
            };
            res.status(400).send(response);
        }
        let response = {
            message: "Todo successfully deleted",
            id: book._id
        };
        res.status(200).send(response);
    })

})

export default router;
