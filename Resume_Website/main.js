const information = {
  "Objective": "Seeking an IT management and Administration role involving, networking, security, and scripting.",
  "Education": [

      {
          "school": "Central Piedmont Community College",
          "degree": "Associates of Science",
          "major": "Art and Design",
          "status": "Graduated",
          "year": "2014",
          "awards": "Graduated on the Dean’s List"
      },

      {
          "school": "University Of North Carolina Charlotte",
          "degree": "Bachelor of Arts",
          "major": "Computer Science",

          "status": "Graduated",
          "year": "2022",
          "awards": "Graduated Magna Cum Laude"
      },
      {
          "school": "University Of North Carolina Charlotte",
          "degree": "Masters of Science",
          "major": "Software, Systems, and Technology",

          "status": "Enrolled",
          "year": "2022",
          "awards": "Admitted to the program by academic merit"
      }
  ],
  "Certification": [{
          "Certi{fication": "Microsoft Azure Administrator (AZ-104):",
          "Describtion": "Hands-on experience administering Azure, along with a strong understanding of core Azure services, Azure workloads, security, and governance. In addition, this role should have experience using PowerShell, Azure CLI, Azure portal, and Azure Resource Manager templates",
          "Link": "https://www.credly.com/badges/2d0b82f6-c823-4b7b-965e-d82db44f6513/public_url"
      },

      {
          "Certification": "Member of The National Society of Leadership and Success ",
          "Date": "2021",
          "Describtion": "The Foundations of Leadership Certificate 1 badge signifies the recipient has: Demonstratedunderstanding of personal communication styles. Created a purpose and vision statement.Identified a long-term goal and created mini-milestones needed to achieve that goal.Organized tools and resources to overcome obstacles. Raised awareness of differentperspectives within teams",
          "Link": "https://members.nsls.org/members/badges/foundation-of-leadership-1/earner/00804224-aa9b-6444-5b5c-03b23f5b8aea/share"
      }

  ],
  "Experience": [{
          "company": "Cellular Tech",
          "title": "Cellphone and Computer technician (Hardware/Software)",
          "startDate": "January 2011",
          "endDate": "February 2018",
          "Responsibilities": [
              "Analyze Software/Hardware Problems and suggest solutions to address the problems.",
              "Handle Sensitive Personal Information and safeguard computers and cellphone from future intrusion",
              "Install and maintain software and hardware",
              "Install and Maintain Operating system on Symbian, Windows, Linux, IOS (Apple), and Android OS."
          ]
      },
      {

          "company": "CGNET on-site for The Duke Endowment",
          "title": "IT Consultant and System Admin",
          "location": "Charlotte, NC",
          "startDate": "January 2020",
          "endDate": "January 2021",
          "Responsibilities": [
              "Provide day-to-day technical support for desktop computers, mobile phones, laptops, tablets,audio-visual systems, printers, and telephony systems via telephone, email or in person",
              "Triage, investigate and resolve issues with IT systems within the office and manage escalations as required to 3rd tier teams",
              "Manage and maintain the network infrastructure and security of the office",
              "Work as a project resource as required to deploy new systems, upgrades, or technologies within the office which may include personal technology and IT infrastructure"
          ]
      },

      {
          "company": "The University of North Carolina Charlotte",
          "title": "Teacher Assistant (Computer Infrastructure ITIS 2110/3110)",
          "location": "Charlotte, NC",
          "startDate": "January 2016",
          "endDate": "May 2016 ",
          "Responsibilities": [
              "Provide technical support for students in the ITIS 2110/3110 Computer Infrastructure course",
              "Help students with their computer problems and assist them with their computer issues",
              "Explain the course concepts and provide assistance to students in the course",
              "Maintain Hardware equipment and software for the course (i.e. Switches, Servers, Firewalls, Routers)"
          ]
      }



  ],



  "Interests": ["Developing new post-exploitation modules for Metasploit Framework.",
      "Writing a library to speed up work on Visual Studio and Eclipse IDE.",
      "Systems Administration, Networking, and Security implentation with Microsoft Azure.",
      "Researching and implementing new technologies and methods to improve the security of the organization."
  ],

  "Skills": ["Linux Terminal/Bash scripting",
      "SQL Management (MSSQL, MYSQL, PosgreSQL, and ORACLE)",
      "Administration for Microsoft Office 360 Suite (Exchange, Outlook, and OneNote, and SharePoint)",
      "Penetration Testing (Metasploit Framework, Nmap, and Wireshark)",
      "Help Desk Support (Service Now Ticketing, Jira, Kaseya VSA)",
      "Network Administration (Cisco, Juniper, and Cisco ASA)",
      "System Administration (Windows, Linux, and Mac OS)",
      "Web Development (HTML, CSS, JavaScript, and PHP)",
      "Windows Server Administration (Active Directory, DHCP, DNS, and DHCP)",
      "Windows Server Management (IIS, Windows Server, and Windows Server 2012)",
      "Windows Server Security (Windows Server 2012, Windows Server 2012 R2, and Windows Server 2016)",
      "Windows Server Virtualization (Hyper-V, VMWare, and Hyper-V VMs)",
      "C#/JAVA & Python/JavaScript Software Development (Web Development, Web Services, and Mobile Development)"
  ],

  "Languages": ["Arabic", "English"],

  "Publications": [{
          "name": "Github",
          "url": "https://github.com/Murtadham",
          "description": "Github Profile"
      },

      {

          "name": "LinkedIn",
          "url": "https://www.linkedin.com/in/murtadham-khan-a9a8a817a/",
          "description": "LinkedIn Profile"
      },
      {
          "name": "Resume",
          "url": "https://www.findasnake.com/resume.pdf",
          "description": "Resume"
      }
  ]
}
 
const LanguagesComponent =()=>{
  let html = '';
  for (i in Object.keys(information.Languages)) {
    html += `<li>${information.Languages[i]}</li>`;
  }
   return  `<h3 id="Languages">  Languages:   </h3>  ${html}`
}


const PublicationsComponent = ()=>{
    let html = "";
    for (i in Object.keys(information.Publications)) {
        html += `<li><a href="${information.Publications[i].url}">${information.Publications[i].name}</a> - ${information.Publications[i].description}</li>`; 
          
    }
    return `<h3 id="Publications">  Publications:   </h3>  ${html}`;
  }


const EducationComponent = () => {
    let html = "";
    for (i in Object.keys(information.Education)) {
        let education = information.Education[i];
        let educationComponent = document.createElement("div");
        educationComponent.classList.add("education");

        educationComponent.innerHTML += `

      <p id="school">${education.school}</p>

      <p id="degree">${education.degree} in ${education.major}</p>
      <p id="year" >${education.status} in  ${education.year}</p>
      <p id="award">Awarded: ${education.awards}</p>
      `;
        html += educationComponent.outerHTML;
        document.querySelector("#column-1").appendChild(educationComponent);

    }

    return `<h3 id="Education">  Education:   </h3>  ${html}`;
}



const SkillsComponent = () => {
        let Skills = `<h3 id="Skills">Skills:</h3>` + information.Skills.map(skill => {
            return (`

    <ul>
       <li id="skill">${skill}</li>
     </ul>`);
        }).join("");

        return Skills;
    }

        const CertificationComponent = () => {
            let html = "";
            for (i in Object.keys(information.Certification)) {
                let certification = information.Certification[i];
                let certificationComponent = document.createElement("div");
                certificationComponent.classList.add("certification");

                certificationComponent.innerHTML += `
      <a href=${certification.Link} id="cert_link">  <p id="certification">${certification.Certification}</p> </a>
      <p id="date">Certification Year: ${certification.Date}</p>
      <p id="describtion"> ${certification.Describtion}</p>
      `;
                html += certificationComponent.outerHTML;
            }
            return '<h3 id="Certification">Certification:</h3>' + html;
        }

        const ExperienceComponent = () => {
                let html = "";
                for (i in Object.keys(information.Experience)) {
                    let experience = information.Experience[i];
                    let experienceComponent = document.createElement("div");
                    experienceComponent.classList.add("experience");
                    experienceComponent.innerHTML += `
      <p id="company"><strong> Employer: </strong> ${experience.company}</p>
      <p id="title">${experience.title}</p>
      <p id="location">${experience.location} | ${experience.startDate} - ${experience.endDate}</p>
      <p id="Responsibilities"><strong>Responsibilities:</strong> ${experience.Responsibilities.map(responsibility => {
        return( `
        <ul>
          <li id="responsibility">${responsibility}</li>
        </ul>`);
      }).join("")}</p>
      `;
      html += experienceComponent.outerHTML;
  }
  return  '<h3 id="Experience">Experience:</h3>' +html;
}
const InterestComponent = () => {
  let html = "";
  for (i in Object.keys(information.Interests)) {
      let interest = information.Interests[i];
      let interestComponent = document.createElement("div");
      interestComponent.classList.add("interest");
      interestComponent.innerHTML += `
      <ul>
        <li id="interest">${interest}</li>

      </ul>`;
      html += interestComponent.outerHTML;
  }

  return  '<h3 id="Interests">Interests:</h3>' +html;
}



const load = () => {

  // Creating Components
  let sections = Object.keys(information);
  let Education  = EducationComponent()
  let Objective = '<h3 id="Objective"> Objectives: </h3>' +  information.Objective;
  let Skills = SkillsComponent();
  let Certification = CertificationComponent();
  let Experience = ExperienceComponent();
  let Interest = InterestComponent();
  let Publications = PublicationsComponent();
  let Languages = LanguagesComponent();

// Creating Elements for each section
let sectionsArray = document.createElement("div");
let educatoion = document.createElement("section")
let objective = document.createElement("section")
let skills = document.createElement("section")
let certification = document.createElement("section")
let experience = document.createElement("section")
let interest = document.createElement("section");
let publications = document.createElement("section");
let languages = document.createElement("section");
// setting the sections
educatoion.innerHTML = Education;
objective.innerHTML = Objective;
skills.innerHTML = Skills;
certification.innerHTML = Certification;
experience.innerHTML = Experience;
interest.innerHTML = Interest;
publications.innerHTML = Publications;
languages.innerHTML = Languages;
// Add sections to sectionsArray
sectionsArray.appendChild(objective);
sectionsArray.appendChild(educatoion);
sectionsArray.appendChild(certification);
sectionsArray.appendChild(experience);
sectionsArray.appendChild(skills);
sectionsArray.appendChild(interest);
sectionsArray.appendChild(publications);
sectionsArray.appendChild(languages);

  // Appending Components
  document.querySelector("#column-1").appendChild(sectionsArray);


  

  

  
  


};




window.onload = load;