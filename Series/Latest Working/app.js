const fetch = require('fetch');

const people_url = 'https://raw.githubusercontent.com/MurtadhaM/ITSC-4155/main/staff_data.json';
const topics_url = 'https://raw.githubusercontent.com/MurtadhaM/ITSC-4155/main/topics_group.json';
people = []


const DownloadFile =

  async (url) => {

    return new Promise((resolve, reject) => {
      fetch.fetchUrl(url, (error, meta, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(body.toString());
        }
      });
    });
  }



function ParseData() {

  // Download the json files
  DownloadFile(people_url).then(data => {
    staff = JSON.parse(data);
    // process the json for the employee data
    processData(staff);
  }).catch(error => {
      console.log(error);
    }

  ).finally(() => {});

  const processTopics = (data) => {
    console.log('Processing Topics');
    const topics = data[0];
  }
}



// process the json for the employee data
const processData = (data) => {

  const staff = data[0];
  const people = [];
  const college_keys = Object.keys(staff);
  for (i = 0; i < college_keys.length; i++) {
    const dept_keys = Object.keys(staff[college_keys[i]]);
    for (j = 0; j < dept_keys.length; j++) {
      const keys = Object.keys(staff[college_keys[i]][dept_keys[j]]);

      for (k = 0; k < keys.length; k++) {
        let item = {
          ...staff[college_keys[i]][dept_keys[j]][keys[k]]
        };
        item.academic_interests = [];
        if (
          staff[college_keys[i]][dept_keys[j]][keys[k]].hasOwnProperty(
            "academic_interests"
          )
        ) {
          for (
            z = 0; z <
            staff[college_keys[i]][dept_keys[j]][keys[k]][
              "academic_interests"
            ].length; z++
          ) {
            if (
              staff[college_keys[i]][dept_keys[j]][keys[k]]
              .academic_interests[z] != ""
            ) {
              item.academic_interests.push(
                staff[college_keys[i]][dept_keys[j]][keys[k]]
                .academic_interests[z]
              );
            }
          }
        }
        item.name = keys[k];
        people.push(item);

      }

    }
  }
  people = people;
  return people;

}




function DownloadTopics() {
  DownloadFile(topics_url).then(data => {

    topics = JSON.parse(data);
    colleges = Object.keys(topics);
    values = Object.values(topics);
    // process the json for the employee data
    ParseTopics(topics);
  })
}
// Define recursive function to print nested values
function ParseTopics(obj) {
  t = []
  for (department in obj) {
    for (topic in obj[department]) {
      t.push(obj[department][topic])
    }

  }

  return t;
};