import { ReactDOM } from "react-native";
import { StyleSheet, Text, View ,Button } from 'react-native';
import React from 'react';
import fun  from './LOADER';


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text : {
    color: 'red',
    fontSize: 28,
  }
});



 function getInformation() {
  

 let output =  fun();
 
  console.log(output)
} 




const FlatListBasics = () => {
  return (
    
    <View style={styles.container}>
        <Text style={styles.text}>Hello World</Text>
        <Button title="Click Me" onPress={    () => {  getInformation() } } />
        </View>
  );
}

export default FlatListBasics;

