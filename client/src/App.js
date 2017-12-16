import React, { Component } from 'react';
import BooksTable from './components/BooksTable';
import 'bootstrap/dist/css/bootstrap.css';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BooksTable/>
      </div>
    );
  }
}

export default App;
