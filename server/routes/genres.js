import express from 'express';
import Genre from '../models/genre';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
    Genre.find({},(err,docs) => {
        if(err){
            console.log("error fetching genres data: " +err.message);
        }
        console.log(docs.length);
        res.send(docs);
    })
});

export default router;
