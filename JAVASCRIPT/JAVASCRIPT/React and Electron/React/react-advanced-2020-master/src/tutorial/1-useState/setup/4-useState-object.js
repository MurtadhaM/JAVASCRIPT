import React, { useState } from 'react';

const UseStateObject = () => {

  const changeMessage = () => {
    console.log(person.message);
    
  person.message = 'Hello World'
  person.age = person.age + 1
    
    setPerson( {person} );
  
  }
  const [person, setPerson] = useState({name: 'peter', age: '19', message: 'He is the best'});
  console.log(person)
  return (
    <>
    <h2>useState object example</h2>;
    <p>{person.name}</p>
    <p>{person.age}</p>
    <p>{person.message}</p>
    <buton type="buton" className="btn" onClick={() => {changeMessage()}}>Change</buton>
    
    
    </>

 
  ) 

};

export default UseStateObject;
