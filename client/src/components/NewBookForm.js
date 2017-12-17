import React from 'react';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import {isEqual, isEmpty} from 'lodash';

class NewBookForm extends React.Component {
    state = {
        genre: this.props.genres[0].name
    };
    shouldComponentUpdate(nextProps, nextState){
        if(!isEqual(this.props.genres, nextProps.genres) || !isEqual(this.state.validationError, nextState.validationError)){
            return true;
        }
        return false;

    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    isValidDate = () => {
        if(isEmpty(this.state.publicationDate)){
            return true;
        }
        let d = new Date(this.state.publicationDate);
        if(!d.getTime() && d.getTime() !== 0){
             return false; // Invalid date
        }

        return true;
    }

    addNewBook = () =>{
        if(!this.state.author || !this.state.title || !this.state.ISBN){
            this.setState({validationError: "Please pay Attention, Author, Title and ISBN are mandatory fields"});
            return;
        }
        if(!this.isValidDate()){
            this.setState({validationError: "Please use this date Format yyyy/mm/dd"});
            return;
        }
        let publicaitonDate = this.state.publicationDate ? new Date(this.state.publicationDate) : '';
        fetch("http://localhost:3001/books", {
            method: 'POST',
            body: JSON.stringify({
                title: this.state.title,
                author: this.state.author,
                description: this.state.description ? this.state.description : '' ,
                isbn : this.state.ISBN,
                publicationDate : publicaitonDate,
                price: this.state.price ? this.state.price : '',
                genre: this.state.genre ? this.state.genre : '',
                success: function(msg) {
                    console.log("Update succeeded");
                }//end function
            }),  // send it as stringified json
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            this.props.fetchData();
            this.props.closeFormPopUp();
        });
    }
    render(){
        let genreOptions = this.props.genres.map((genre) => {
            return <option key={genre._id}>{genre.name}</option>
        })
        return(
            <div className='new-book-form'>
                <div className='close-newbook-form' onClick={this.props.closeFormPopUp}>
                    X
                </div>
                <Form  className='input-form' onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="bookTitle">*Tilte</Label>
                        <Input required type="text" name="title" id="bookTitle" onChange={this.handleInputChange.bind(this).bind(this)} placeholder="Please enter your book's Title" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="bookAuthor">*Author</Label>
                        <Input required type="text" name="author" id="bookAuthor" onChange={this.handleInputChange.bind(this)} placeholder="Please enter your book's Author name" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="bookISBN">*ISBN</Label>
                        <Input required type="text" name="ISBN" id="bookISBN" onChange={this.handleInputChange.bind(this)} placeholder="Please enter your book's ISBN" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="bookPublicationDate">Publication Date</Label>
                        <Input type="text" name="publicationDate" id="bookPublicationDate" onChange={this.handleInputChange.bind(this)} placeholder="Please enter your book's Publication Date in this format yyyy/mm/dd" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="bookGenre">Genre </Label>
                        <Input type="select" name="genre" id="bookGenre" onChange={this.handleInputChange.bind(this)} >
                            {genreOptions}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="bookPrice">Price</Label>
                        <Input type="number" name="price" id="bookPrice" onChange={this.handleInputChange.bind(this)} placeholder="Please enter your book's price" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="bookDescription">Description</Label>
                        <Input type="textArea" name="description" id="bookDescription" onChange={this.handleInputChange.bind(this)} placeholder="Please enter your book's description" />
                    </FormGroup>
                    <Button className='form-submit' onClick={this.addNewBook.bind(this)}>Submit</Button>
                    <div className='validation-error' >{this.state.validationError ? this.state.validationError : ""} </div>
                </Form>
            </div>
        )
    }
}

export default NewBookForm