import React from 'react';
let title = 'Hello World';
const ErrorExample = () => {
  return(
    <React.Fragment> 
      <h1>{title}</h1>
      <button type="button" className="btn" onClick={handleClick}>Change title</button>


      </React.Fragment>

  )
}


// Render Component Does Not Work
function handleClick() {
  title = 'Goodbye World';
  console.log(title);
}

export default ErrorExample;
