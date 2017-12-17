import mongoose from 'mongoose';
import Genre from './models/genre';
import BookItem  from './models/book';
import books from './mockData/booksMockData';

mongoose.connect('mongodb://localhost/bookstore', (err,db) => {
    console.log('connected');
    mongoose.connection.db.dropDatabase();
    var genres = [ {
            name:'Science fiction'
        },{
            name: 'Satire'
        },{
            name: 'Drama'
        },{
            name: 'Action'
        },{
            name: 'Romance'
        },{
            name: 'Mystery'
        },{
            name: 'Horror'
        }
    ];
    //for each genre populate the DB with a book
    genres.forEach((genre) =>{
        new Genre(genre).save((err,genre)=>{
            var res = books.filter(book =>book.genre == genre.name);
            if(res){
                var book = res[0];
                book.genre = genre;
                new BookItem(book).save((err,item)=>{
                    if(err){
                        console.log('error happend while adding predefined books: ' + err)
                    }
                });
            }

        });
    });

});