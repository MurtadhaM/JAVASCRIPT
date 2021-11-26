import {useRouter} from 'next/router'
import {Cookies} from 'react-cookie'
export  default  function  User({user}) {
    

    const router = useRouter();
    

    
   const {id} = router.query
   
 var user1 = getUser(id);
    
    return (
getUser(id).then(user => {
    console.log(user)
    return (
        <div>
            <h1>User Page</h1>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <p>{user.website}</p>
        </div>
    )
})  

 


 

                 
                 
               
    
    
 
      
        
    )  
}
 

function getUser(id) {
    const response =  fetch(`http://localhost:4000/user.json`);
    const data =  response;
    console.log(data)
    return data;
}