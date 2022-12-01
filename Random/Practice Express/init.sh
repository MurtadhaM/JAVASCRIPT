#!env bash

# This script is used to initialize the environment for the
# Variables to store in the environment
# Username
export MONGODB_USERNAME="admin"
# PASSWORD
eval $(cat ~/.mongodb.config |grep PAS)
# SECRETs
eval $(cat ~/.mongodb.config |grep SEC)



## THE DIRECTORY STRUCTURE of MVC   
```.
├── config/
│   └── index.js
├── models/
├── public/
├── routes/
│   ├── api/
│   │  └── index.js
│   └── index.js
├── app.js
├── package.json
└── .gitignore
```

# Create The Directory Structure For The Project

# Based on the programming language used, we will list different frameworks and libraries
function getFrameworks(language){
# Listing the frameworks and libraries
Python = "Django", "Flask"
Javascript = "React", "Angular", "Vue"
Java = "Spring", "Hibernate"
NodeJS = "Express", "Koa"
ASP.NET = "ASP.NET Core", "ASP.NET MVC"

# Return the frameworks and libraries based on the language
if language == "Python":
return Python
elif language == "Javascript":
return Javascript
elif language == "Java":
return Java
elif language == "NodeJS":
return NodeJS
elif language == "ASP.NET":
return ASP.NET
else:
return "No Frameworks Found"
      
}

# Get the Programming Language From The User (Javascript, Java, DotNet, Python)

echo "Please Enter The Programming Language You Want To Use For The Project: "
echo "1. Javascript"
echo "2. Java"
echo "3. DotNet"
echo "4. Python"
read language





# Getting the desired Design Pattern the user wants to use (MVC, MVP, MVVM)

echo "What Design Pattern do you want to use?"
echo "1. MVC"
echo "2. MVP"
echo "3. MVVM"
read -p "Enter the number of the design pattern you want to use: " designPattern


# Getting the Framework the user wants to use React, Angular, Vue, Flutter, React Native, Ionic

echo "What Framework do you want to use?"
echo "1. React"
echo "2. Angular"
echo "3. Vue"
echo "4. Flutter"
echo "5. React Native"
echo "6. Ionic"
read -p "Enter the number of the framework you want to use: " framework

