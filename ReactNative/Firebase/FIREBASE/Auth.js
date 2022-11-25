import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "react-native-firebase";
import { useEffect, useState } from "react";

const auth = getAuth();



export default function Auth() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    setLoading(true);
    setError("");
    createUserWithEmailAndPassword(auth, email, password)

      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        setLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        setLoading(false);
      });
  };

  const handleSignIn = () => {
    setLoading(true);
    setError("");
    signInWithEmailAndPassword(auth, email, password)


      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        setLoading(false);
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        setLoading(false);
      });
  };

  const handleSignOut = () => {
    signOut(auth)


      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        // An error happened.
      });
  };
 
  
  
    return (

      <div>
        <h1>Authentication</h1>
        {user ? (
          <div>
            <h2>Welcome {user.email}</h2>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div>
  
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignUp}>Sign Up</button>
            <button onClick={handleSignIn}>Sign In</button>
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
 
 

 