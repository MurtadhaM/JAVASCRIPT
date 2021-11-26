import React from 'react'
import toast from 'react-hot-toast'
export default function Home() {
  return (
    <div>
      <button onClick=  {() => toast.success('Hello World')}>Click Me</button>
    </div>
    );
   
}
function toast1(msg){
  console.log(msg);
  console.log('THIS IS ALI')
   toast.success(msg);
}

