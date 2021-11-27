import React, { useState } from 'react';




const UseStateBasics = () => {
  const clickMe = () => {
    console.log('Clicked!');
    setText('Clicked!');
  };
  const [text, setText] = useState('Hello World');
  console.log(text);
  console.log(setText);
  return (
<>
<h2>{text}</h2>;
<button className="btn" onClick={clickMe}> Click Me</button>

</>

  )
  
};

export default UseStateBasics;
