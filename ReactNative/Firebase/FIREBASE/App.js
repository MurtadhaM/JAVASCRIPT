import { StyleSheet, Text, View ,Button, TextInput } from 'react-native';
import React from 'react';
import fun  from './LOADER';
import {createRoot} from 'react-dom/client';
import auth from '@react-native-firebase/auth';

import firebase from '@react-native-firebase/app';

import {
  isAndroid,
  isBoolean,
  isString,
  isNull,
  isValidUrl,
} from '@react-native-firebase/app/lib/common';
import {
  createModuleNamespace,
  FirebaseModule,
  getFirebaseRoot,
} from '@react-native-firebase/app/lib/internal';


  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 49,
    color: 'red',
  },

  TextInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    margin: 10,
  },

  labels: {
    fontSize: 49,
    color: 'red',
  },
  
});

  

 function handleLoad() {
  console.log("LOADEDING....")
 let data =    fun();
  console.log(data);
  return data;
 }


async function login (username, password) {
  try {
 
  console.log("LOGIN");
  console.log(username);
  console.log(password);
  const user = await auth().signInWithEmailAndPassword(username, password);
  console.log(user)

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
  } catch (error) {
    console.log(error);
  }
}



  
async function register (username, password) {
  try {
 
  console.log("SIGNUP");
  console.log(username);
  console.log(password);
  const user = await auth().createUserWithEmailAndPassword(username, password);
  console.log(user)

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
  } catch (error) {
    console.log(error);
  }
}



  

 

export default function App() {
  let email = "";

  let password = "";
  const container = document.createElement('div').id = "app";
  const root = createRoot(container);

  root.render (
    <View  styles={styles.container}>
      <TextInput style={styles.TextInput} placeholder="Email" onChangeText={(text) => email = text} />
      <TextInput style={styles.TextInput} placeholder="Password" onChangeText={(text) => password = text} />

      <Button title="Sign In" onPress={
        () => login(email, password).then(() => console.log("DONE"))
      } />
      <Text styles={styles.labels} >  </Text>
      <Button title="Sign Up" onPress={
       () => register(email, password).then(() => console.log("DONE"))
        } />

       <div id="app"></div>
       

    </View>
  );
}

