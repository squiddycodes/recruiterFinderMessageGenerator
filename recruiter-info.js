// import json file
const data = require('C:/Users/septr/Downloads/example.json');
// create function that checks if the phrase EXISTS IN:
// checks phrase is in recruiter_tagline, recruiter_about, recruiter_status
function getRecruiterInfo(phrase) {
    let result = [];
    //convert it to lowercase
    const lowerCase = phrase.toLowerCase();
    //make a loop to iterate
    for (let i = 0; i < data.length; i++) {
        let recruiter = data[i];

        //this checks it
        if (
            recruiter.recruiter_status.toLowerCase().includes(lowerCase) ||
            recruiter.recruiter_about.toLowerCase().includes(lowerCase) ||
            recruiter.recruiter_tagline.toLowerCase().includes(lowerCase)
        ) {
            //if it finds a recruiter with x phrase, them add it
            result.push(recruiter)
        }
    }
    return result
}
console.log(getRecruiterInfo("hr specialist"))

//status, about, tagline    
