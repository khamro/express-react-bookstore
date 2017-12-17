import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { InputGroup, Input, Card, CardText, CardBody,CardTitle, CardSubtitle, Button} from 'reactstrap';
import {debounce, find, isEmpty} from 'lodash';
import NewBookForm from './NewBookForm'
const SEARCH_URL = "http://localhost:3001/books/?title=";
const URL = "http://localhost:3001/books";
const GENRES_URL = "http://localhost:3001/genres";
class HistoryTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            rows: [],
            selectedRow: '',
            showNewBookForm: false
        };
        this.onInputeChange = debounce((query)=> this.fetchBooks(query),500);
    }
    componentDidMount(){
        this.fetchBooks();
        this.fetchGenres();
    }
    fetchGenres = () =>{
        fetch(GENRES_URL, {
                method:"GET",
                mode: 'cors'
            }
        ).then(response =>{
            response.json().then(items => {
                this.setState({genres:items});
            })
        })
    }
    fetchBooks = (query) =>{
        let url = query? SEARCH_URL+query : URL;
        fetch(url, {
                method:"GET",
                mode: 'cors'
            }
        ).then(response =>{
            response.json().then(items => {
                this.setState({books:items});
            })
        })
    }

    handleSerachQuery = (event)=>{
        this.onInputeChange(event.target.value);
    }

    deleteBook = (bookId, event) => {
        if(this.state.selectedRow === bookId){
            this.setState({selectedRow : null});
        }
        event.stopPropagation()
        let self = this;
        fetch(URL + '/' + bookId, {
            method: 'delete'
        }).then(response =>
            response.json().then(json => {
                self.fetchBooks();
            })
        );
    }
    createBooksRows = () => {
        let booksRows = this.state.books.map(book => {
            return(
                <tr key={book._id} onClick={()=>this.setState({selectedRow: book._id})}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{this.getDate(book.publicationDate)}</td>
                    <td>{book.genre.name}</td>
                    <td>{book.isbn}</td>
                    <td>{book.price}</td>
                    <td><Button className="remove-book" onClick={this.deleteBook.bind(this,book._id)}>Remove</Button></td>
                </tr>
            )
        })
        return booksRows;
    }
    getDate = (date)=>{
        var dateObj = new Date(date);
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        return  year + "/" + month + "/" + day ;
    }
    showSelectedBookDetails = ()=>{
        let book = find(this.state.books, { _id: this.state.selectedRow});
        return(
            <Card>
                <div className='close-book-info' onClick={() => this.setState({selectedRow : null})}>
                    X
                </div>
                <CardBody>
                    <CardTitle>{book.title}</CardTitle>
                    <CardSubtitle>By: {book.author}</CardSubtitle>
                    <CardText>{book.description}</CardText>
                </CardBody>
            </Card>
        )
    }
    showNewBookForm = () => {
        this.setState({showNewBookForm : !this.state.showNewBookForm});
    }
    render(){
        return(
            <div>
                <InputGroup className='search-books'>
                    <Input placeholder="Search... Enter your book title" onChange={this.handleSerachQuery} />
                </InputGroup>
                <Button className='new-book-btn' onClick={this.showNewBookForm}>Add new book</Button>
                {this.state.genres && this.state.showNewBookForm ?
                    <div className='form-popup' >
                        <NewBookForm
                            fetchData={this.fetchBooks.bind(this)}
                            genres={this.state.genres}
                            closeFormPopUp = {this.showNewBookForm.bind(this)}
                        />
                    </div>
                    :null}
                <Table className="history-table">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publication Date</th>
                        <th>Genre</th>
                        <th>ISBN</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                    </thead>
                    {isEmpty(this.state.books) ? null : <tbody>{this.createBooksRows()}</tbody>}
                </Table>
                {isEmpty(this.state.selectedRow) ? null : <div className="bookInfo">{this.showSelectedBookDetails()}</div>}
            </div>
        )
    }
}
export default HistoryTable;