// Import axios to fetch the JSON file from GitHub
const axios = require('axios');

// Define the GitHub URL to the raw JSON file
const jsonURL = 'https://raw.githubusercontent.com/squiddycodes/recruiterFinderMessageGenerator/main/example.json';

// create function that checks if the phrase EXISTS IN:
// checks phrase is in recruiter_tagline, recruiter_about, recruiter_status
function getRecruiterInfo(phrase) {
    
    // if no keyphrase is provided
    if (!phrase) {
        console.log("Error: No keyphrase provided")
        return [];
    }

    // Fetch the JSON data using axios
    axios.get(jsonURL)
    .then(function(response) {
        let data = response.data; // Assign fetched data to the variable
        let result = []; // Store matching recruiters

        // convert it to lowercase
        const lowerCase = phrase.toLowerCase();
        
        // make a loop to iterate
        for (let i = 0; i < data.length; i++) {
            let recruiter = data[i];

            // this checks it
            if (
                recruiter.recruiter_status.toLowerCase().includes(lowerCase) ||
                recruiter.recruiter_about.toLowerCase().includes(lowerCase) ||
                recruiter.recruiter_tagline.toLowerCase().includes(lowerCase)
            ) {
                // if it finds a recruiter with x phrases, add them to result
                result.push(recruiter);
            }
        }

        // if no matches found, split the phrase and check each part
        if (result.length === 0 && phrase.includes(" ")) {
            let parts = phrase.split(" "); // split phrase into words
            for (let i = 0; i < parts.length; i++) {
                const partLowerCase = parts[i].toLowerCase(); // convert each part to lowercase
                for (let j = 0; j < data.length; j++) {
                    let recruiter = data[j];

                    // this checks each part
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

        // print the result (list of recruiters)
        console.log(result);
        return result;

    })
    .catch(function(error) {
        // catch any errors while fetching data
        console.log("Error fetching data:", error);
        return [];
    });
}

// Example usage: Pass the phrase you want to search for
getRecruiterInfo("Mechanical Engineer");
