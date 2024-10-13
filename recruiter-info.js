// import json file
const fs = require('fs');

const data = require('C:/Users/septr/Downloads/example.json'); // HAVE TO EDIT, TO WORK WITH GITHUB.
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
            //if it finds a recruiter with x phrases, them add it
            result.push(recruiter)
        }
    }
    if (result.length === 0) {
        if (phrase.includes(" ")) {
            let parts = phrase.split(" ")
            for (let i = 0; i < parts.length; i++) {
                const partLowerCase = parts[i].toLowerCase();
                for (let j = 0; j < data.length; j++) {
                    let recruiter = data[j]; // Correct, iterates over all recruiters for each part
                if (
                    recruiter.recruiter_status.toLowerCase().includes(partLowerCase) ||
                    recruiter.recruiter_about.toLowerCase().includes(partLowerCase) ||
                    recruiter.recruiter_tagline.toLowerCase().includes(partLowerCase)
                ) {
                    result.push(recruiter);
                }
            }
        }
    }
}

        
    return result
    }
// Save output to a JSON file
function saveOutputToFile(phrase, fileName) {
    const result = getRecruiterInfo(phrase);
    
    // Write result to a JSON file
    fs.writeFile(fileName, JSON.stringify(result, null, 2), 'utf8', (err) => {
        if (err) {
            console.error("An error occurred while writing to the file:", err);
            return;
        }
        console.log("The result has been saved to", fileName);
    });
}

// Example usage
saveOutputToFile("Software Engineering", "selected-recruiters.json"); // Output will be saved as 67
//status, about, tagline    
