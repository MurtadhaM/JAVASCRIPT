import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {books} from './books';
import {Book} from './Book';
// You Must Capitalize the first letter of your component name

function BookList(){
  return ( 
    <section className="bookList">
    {books.map(book => {
    return (
      <Book  key={book.title} {...book} /> 
    )
  })}
  </section>
    
     

      
    
    );
  
}

ReactDOM.render(<BookList />,document.getElementById('root'));