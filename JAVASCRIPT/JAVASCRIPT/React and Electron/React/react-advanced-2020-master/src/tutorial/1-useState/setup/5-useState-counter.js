import React, { useState } from 'react';

const UseStateCounter = () => {

  const [value, setValue] = useState(0);

  return (
    <>
    <section className="container">
    <h2> Simple Counter</h2>
    <h1>{value} </h1>
    <button className="btn" onClick={() => setValue(value + 1)}>+</button>
    <button className="btn" onClick={() => setValue(value - 1)}>-</button>
    <button className="btn" onClick={() => setValue(0)}>Reset</button>

      </section>
    
    
    </>


  )
};

export default UseStateCounter;
