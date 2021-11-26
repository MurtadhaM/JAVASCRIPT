export const Book = (props) => {

    const eventHandler = () => {
      console.log('Added to cart');
    }
    
    return (<article className="Book">
  
      <h2 className="book" style={{color: 'blue'}}>{props.title}</h2>
  
      <img src={props.img} alt="book" />  
      <button  type="button" onClick={eventHandler}>Add to Cart</button>
  
  
    </article>
  
    )
  };
