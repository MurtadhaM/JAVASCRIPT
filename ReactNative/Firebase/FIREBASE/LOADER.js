
/*
Author:Murtadha Marzouq
@description: This is the main file that loads all the components
@date: 04/13/2022
*/

/****
 * CREATE THE COMPONENTS AND APPEND THEM TO THE DOM
 ****/

/****
 * LANGUAGE COMPONENTS
 ****/


let output = {

    json_file : 1 ,
    NavBar :  1 ,
    load : 1
   
  }
  
  const LanguagesComponent = () => {
    let html = ''
  
  
     information = output.json_file  ;
    for (i in Object.keys(information.Languages)) {
      html += `<ul><li>${information.Languages[i]}</li></ul>`
    }
    return `<h3 id="Languages">  Languages:   </h3>  ${html}`
  }
  
  /****
   * P U B L I C A T I O N S C O M P O N E N T
   ****/
  
  const PublicationsComponent = () => {
    let html = ''
    information = output.json_file  ;
  
    for (i in Object.keys(information.Publications)) {
      html += `<ul><li><a id="publications"  href="${information.Publications[i].url}">${information.Publications[i].name}</a> - ${information.Publications[i].description}</li> </ul>`
    }
    return `<h3 id="Publications">  Publications:   </h3>  ${html}`
  }
  
  /****
   * EDUCATION COMPONENT
   ****/
  const EducationComponent = () => {
    let html = ''
    information = output.json_file  ;
  
    for (i in Object.keys(information.Education)) {
      let education = information.Education[i]
      let educationComponent = document.createElement('div')
      educationComponent.classList.add('education')
  
      educationComponent.innerHTML += `
  
        <p id="school">${education.school}</p>
  
        <p id="degree">${education.degree} in ${education.major}</p>
        <p id="year" >${education.status} in  ${education.year}</p>
        <p id="award">Awarded: ${education.awards}</p>
        `
      html += educationComponent.outerHTML
      //document.querySelector("#column-1").appendChild(educationComponent);
    }
  
    return `<h3 id="Education">  Education:   </h3>  ${html}`
  }
  
  const SkillsComponent = () => {
    information = output.json_file  ;
  
    let Skills =
      `<h3 id="Skills">Skills:</h3>` +
      information.Skills.map((skill) => {
        return `
  
      <ul>
         <li id="skill">${skill}</li>
       </ul>`
      }).join('')
  
    return Skills
  }
  
  const CertificationComponent = () => {
    let html = ''
    information = output.json_file  ;
  
    for (i in Object.keys(information.Certification)) {
      let certification = information.Certification[i]
      let certificationComponent = document.createElement('div')
      certificationComponent.classList.add('certification')
  
      certificationComponent.innerHTML += `
        <a href=${certification.Link} id="cert_link">  <p id="certification">${certification.Certification}</p> </a>
        <p id="date">Certification Year: ${certification.Date}</p>
        <p id="describtion"> ${certification.Describtion}</p>
        `
      html += certificationComponent.outerHTML
    }
    return '<h3 id="Certification">Certification:</h3>' + html
  }
  
  const ExperienceComponent = () => {
    let html = ''
    information = output.json_file  ;
  
    for (i in Object.keys(information.Experience)) {
      let experience = information.Experience[i]
      let experienceComponent = document.createElement('div')
      experienceComponent.classList.add('experience')
      experienceComponent.innerHTML += `
        <p id="company">${experience.company}</p>
        <p id="title">${experience.title}</p>
        <p id="location">${experience.location} | ${experience.startDate} - ${
        experience.endDate
      }</p>
        <p id="Responsibilities"><strong>Responsibilities:</strong> ${experience.Responsibilities.map(
          (responsibility) => {
            return `
          <ul>
            <li id="responsibility">${responsibility}</li>
          </ul>`
          },
        ).join('')}</p>
        `
      html += experienceComponent.outerHTML
    }
    return '<h3 id="Experience">Experience:</h3>' + html
  }
  const InterestComponent = () => {
    let html = ''
    information = output.json_file  ;
  
    for (i in Object.keys(information.Interests)) {
      let interest = information.Interests[i]
      let interestComponent = document.createElement('div')
      interestComponent.classList.add('interest')
      interestComponent.innerHTML += `
        <ul>
          <li id="interest">${interest}</li>
  
        </ul>`
      html += interestComponent.outerHTML
    }
  
    return '<h3 id="Interests">Interests:</h3>' + html
  }
  
  const NavBar = () => {
    information = output.json_file  ;
    let html = `<a  class="phone" id="link"    href="${information.Links['phone']}"}"> (213)-458-4982</a> |`
    html += `<a  class="email}" id="link"    href="${information.Links['email']}"> mmarzouq@uncc.edu </a> |`
    html += `<a  class="Github" id="link"    href="${information.Links['Github']}"> Github </a> |`
    html += `<a  class="website" id="link"    href="${information.Links['website']}"> LinkedIn </a>| `
    html += `<a  class="resume" id="link"    href="${information.Links['resume']}"> Resume</a> `
    html += `<p  class="city" id="city"    href="${information.Links['city']}">Charlotte, NC</p> `
  
     
    html +=    `<img src=${information.Picture} class="profile_picture" id="profile_picture" alt="Profile Picture"> <h1 id="name">${information.Name}</h1> <div id="navbar" class="links"><divider class="divider" id="divider"></divider> ` 
  
      return html
  }
  /****
   * @description: This function loads all the components
   * @param: none
   * @return: none
   ****/
  const load = () => {
    //Setting up the image
    // Creating Components
    let sections = Object.keys(information)
    let Education = EducationComponent()
    let Objective =
      '<h3 id="Objective"> Objectives: </h3>' + information.Objective
    let Skills = SkillsComponent()
    let Certification = CertificationComponent()
    let Experience = ExperienceComponent()
    let Interest = InterestComponent()
    let Publications = PublicationsComponent()
    let Languages = LanguagesComponent()
  
    // Creating Elements for each section
    let Firstcolumn = document.createElement('div')
    let Secondcolumn = document.createElement('div')
    let educatoion = document.createElement('section')
    let objective = document.createElement('section')
    let skills = document.createElement('section')
    let certification = document.createElement('section')
    let experience = document.createElement('section')
    let interest = document.createElement('section')
    let publications = document.createElement('section')
    let languages = document.createElement('section')
    // setting the sections
  
    educatoion.innerHTML = Education
    objective.innerHTML = Objective
    skills.innerHTML = Skills
    certification.innerHTML = Certification
    experience.innerHTML = Experience
    interest.innerHTML = Interest
    publications.innerHTML = Publications
    languages.innerHTML = Languages
    // Add sections to sectionsArray
    // Firstcolumn.innerHTML =  `<img src=${information.Picture} class="profile_picture" id="profile_picture" alt="Profile Picture">`
    Firstcolumn.appendChild(objective)
    Firstcolumn.appendChild(educatoion)
    Firstcolumn.appendChild(certification)
    Firstcolumn.appendChild(experience)
    Secondcolumn.appendChild(skills)
    Secondcolumn.appendChild(interest)
    Secondcolumn.appendChild(publications)
    Secondcolumn.appendChild(languages)
  
    // Creating the divider
  
    let page = Firstcolumn.innerHTML + '  </div> ' + Secondcolumn.outerHTML 
    
  
    return page
  }
  
   
  const HEAD =( ) => {
    return `<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' href='https://raw.githubusercontent.com/MurtadhaM/FindASnake/main/main.css'>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <script src="https://raw.githubusercontent.com/MurtadhaM/FindASnake/main/main.js" type="text/javascript"></script> 
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,700;1,400&family=Sora:wght@100;300;400;500;700&display=swap" rel="stylesheet" />
    <title>Murtadha Marzouq Home Page</title>
    <style id="style" class="style">
  
    </style>
  </head>`
  }
  
  
  
  
    function fun() {
  
    let json_file = 
     fetch(
      'https://raw.githubusercontent.com/MurtadhaM/FindASnake/main/information.json',
    )
  
  
      .then((response) => response.json())
      .then((data) => {
  
        json_file = data
  
        
        output.json_file = json_file
        output.NavBar = NavBar()
        output.EducationComponent = EducationComponent()
        output.HEAD = HEAD()
        
        output.PAGE = load()
        return json_file
  
      })
      .catch((error) => {
        console.error('Error:', error)
      }
      )
      
      return  output
  }
  
  
   
  
  module.exports =     fun