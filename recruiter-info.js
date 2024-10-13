// import json file
const fs = require('fs');
const readline = require('readline');

const data = require('C:/Users/septr/OneDrive/Desktop/projects/LinkedInRecruiter/recruiters.json'); 
// Create an interface for reading input from the console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
// now, this will save output to file
function saveOutputToFile(phrase) {
    const result = getRecruiterInfo(phrase);
    const fileName = 'selected-recruiters.json';  //this is the name we will be using

    // write it as json
    fs.writeFile(fileName, JSON.stringify(result, null, 2), 'utf8', function(err) {
        if (err) {
            console.error("An error occurred while writing to the file:", err);
            return;
        }
        console.log("The result has been saved to", fileName);
    });
}

// ask the user for the input phrase, always save to a predefined file
rl.question('Enter the phrase to search: ', function(phrase) {
    saveOutputToFile(phrase);
    rl.close();
});
