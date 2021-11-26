import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
export default function Home() {
    const [count, setCount] = useState(0);
    useEffect(() => {
       return  console.log('count', count)
        
    }, [count] ) 
   
  return ( <>{Navbar()}
        <h2>Hello World</h2>
        <button onClick={() => setCount(count + 1)}>Clicked Me {count} times </button>

      </>)  
 } 

 function Navbar() {
     var Image = require('next/image')
      Image.href = 'blob:null/985f839b-fc45-214b-a923-3357ce4b2e7a'
    return (
        <>
            <Head>
                <title>My App</title>
                <link rel="icon" href={Image.image} />
            </Head>
           <div className={styles.image}> </div>
            <div className={styles.container}>
                <h1>My App</h1>
            </div>
        </>
    )
}



