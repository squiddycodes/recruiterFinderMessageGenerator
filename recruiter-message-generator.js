const OpenAI = require('openai');
const fs = require('fs');
require("dotenv").config();

(async () => {
    //INIT OPENAI MODEL
    const openAIClient = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY']
    });
    //END INIT OPENAI MODEL 

    const data = fs.readFileSync('selected-recruiters.json', 'utf8');//load recruiter json
    const recruiters = JSON.parse(data);

    const resume = fs.readFileSync('resume.txt', 'utf8');

    let outputJSONS = [];

    for(let i = 0; i < recruiters.length; i++){//iterate through recruiters, generate "One shot" output messages
        let prompt = "Consider a job recruiter with information:" + recruiters[i] + "\nAnd a job searcher with resume:" + resume + "\nCreate a concise LinkedIn DM greeting for the job searcher; preferably including a specific connection from the resume to the recruiter's personal info. Do not include a subject line; The recruiter's name is " + recruiters[i].recruiter_name;
        outputJSONS.push(convertToFinishedRecruiterObject(recruiters[i].recruiter_name, recruiters[i].recruiterLocation, recruiters[i].recruiter_linkedin, 
        recruiters[i].recruiter_about, recruiters[i].recruiter_education, recruiters[i].recruiter_experience, recruiters[i].recruiter_tagline, 
        recruiters[i].recruiter_status, recruiters[i].search_query, await newPrompt(openAIClient, prompt)));
    }
    const jsonString = JSON.stringify(outputJSONS, null, 2);
    fs.writeFile('recruiter-message-output.json', jsonString, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File successfully written!');
        }
    });

})();

async function newPrompt(client, input){
    const output = await client.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages: [
          {
            role:"user",
            content:input
          }
        ]
    });
    return output.choices[0].message.content;
}

function convertToFinishedRecruiterObject(recruiterName, recruiterLocation, recruiterLinkedIn, recruiterAbout, recruiterEducation, recruiterExperience, 
    recruiterTagline, recruiterStatus, searchQuery, recruiterMessage){
   return {
    recruiter_name: recruiterName || '',
    recruiter_location: recruiterLocation || '',
    recruiter_linkedin: recruiterLinkedIn || '',
    recruiter_about: recruiterAbout || '',
    recruiter_education: recruiterEducation || '',
    recruiter_experience: recruiterExperience || '',
    recruiter_tagline: recruiterTagline || '',
    recruiter_status: recruiterStatus || '',
    search_query: searchQuery || '',
    recruiter_message: recruiterMessage || ''
   };
}