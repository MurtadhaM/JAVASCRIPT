import React from 'react';
import { data } from '../../../data';
import { useState } from 'react';

const UseStateArray = () => {
  const [people, setPeople] = React.useState(data);
  const removeItem = (id) => {
    setPeople(people.filter(person => person.id !== id));
  }
  return (
    <>
      <h1>useState Array</h1>
      {people.map((person) => (
        <div key={person.index}>
          <p>
            {person.name} is {person.age} years old
            <button onClick={() => removeItem(person.id) }>
              Remove
            </button>
          </p>
        </div>
      ))}
      <button className="btn" onClick={() => setPeople([])}>Reset</button>

    </>
  );
};


export default UseStateArray;
