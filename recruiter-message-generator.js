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
        let fullName = recruiters[i].recruiter_name.split(" ");
        
        //MR OR MS PROMPT
        let pronoun = await newPrompt(openAIClient, "Is the first name \"" + fullName[0] + "\" more masculine or feminine? Your output should be one word: \"Mr.\" or \"Ms.\"");
        //END MR OR MS PROMPT

        let recruiterMainIdeas = await newPrompt(openAIClient, "Consider a recruiter with LinkedIn about section: " + recruiters[i].recruiter_about + "\n\n -- linkedin status: " + recruiters[i].recruiter_status + "\n\n -- and linkedin tagline: " + recruiters[i].recruiter_tagline + ".\n\nIn one sentence, answer:Where do they work? What skills are they recruiting for? If none are listed, WHAT SKILLS DOES THEIR COMPANY VALUE?");
        //console.log(recruiterMainIdeas + "\n\n");
        let prompt = "Consider a job recruiter, " + recruiterMainIdeas + "\nYou are a job seeker, with resume:" + resume + "\n\n-----Create a concise LinkedIn DM greeting, you want to make an impression on this recruiter. Find something in your resume to emphasize, that the recruiter will like; preferably a skill they could be looking for or an experience you have that sets you apart. Start with \"Dear " + pronoun + " " + fullName[1] + "\"; end with \"Sincerely\" or a similar closing";
        //let longPrompt = "Use the following information:Your Resume (given: containing your skills, experiences, education, etc.) -- Recruiter's Information (recruiter name, location, LinkedIn profile, about section, education, tagline, and company details) - Use the recruiter information to infer about what qualifications/skills they're looking for and what positions they're hiring for\n Write a concise LinkedIn greeting message that:Starts with a friendly greeting and the recruiter's name. Expresses your interest in their company and something SPECIFIC UNIQUE from the given recruiter information that compliments something from your resume. Ends with a polite call to action (e.g., requesting to connect or discuss further) and a friendly sign-off. Ensure the message is conversational but direct, highlighting the strongest connection between you and the recruiter in a concise way. Address the recruiter as \"" + pronoun + " " + fullName[1] + "\". RESUME: " + resume + "RECRUITER DATA: " + recruiters[i];
        outputJSONS.push(convertToFinishedRecruiterObject(recruiters[i].recruiter_name, recruiters[i].recruiterLocation, recruiters[i].recruiter_linkedin, 
        recruiters[i].recruiter_about, recruiters[i].recruiter_education, recruiters[i].recruiter_experience, recruiters[i].recruiter_tagline, 
        //recruiters[i].recruiter_status, recruiters[i].search_query, await newPrompt(openAIClient, shortPrompt)));//SHORT PROMPT
        recruiters[i].recruiter_status, recruiters[i].search_query, (await newPrompt(openAIClient, prompt))));//LONG PROMPT
        console.log((i+1) + "/" + recruiters.length);//show progress
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
        model:"gpt-4",
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