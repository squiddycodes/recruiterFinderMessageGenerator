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
    
    //user's data
    const name = ["Derek", "Guidorizzi"];
    const school = "Penn State University";
    const major = "Computer Science";
    const jobTitle = "AI Engineer";
    const jobCompany = "OfferPilot";


    let outputJSONS = [];

    for(let i = 0; i < recruiters.length; i++){//iterate through recruiters, generate "One shot" output messages
        let fullName = recruiters[i].recruiter_name.split(" ");
        let finalPrompt = undefined;
        if(recruiters[i].recruiter_about != ''){//IF THEY HAVE ABOUT SECTION
            //SUMMARIZE ABOUT SECTION + tagline
            let aboutSummarization = await newPrompt(openAIClient, "You are trying to make an impression on a recruiter. You can see their LinkedIn about section. Summarize in 1-2 sentences: What skills/qualifications are they looking for?\nABOUT:" + recruiters[i].recruiter_tagline + "--" + recruiters[i].recruiter_about);
            console.log("\nAbout Summarization: " + aboutSummarization);

            //compare about summarization to resume - pick out an experience
            let comparisonToResume = await newPrompt(openAIClient, "Consider " + name[0] + " " + name[1] + "'s Resume:" + resume + "\n\n Pick something from their resume to connect to something SPECIFIC that the recruiter values." + aboutSummarization + " What is the best way to impress this recruiter, given my resume? Did we go to the same school? What experiences, projects, education or skills do I have that could help? Respond in one CONCISE sentence.");
            console.log("Comparison to Resume: " + comparisonToResume);

            //given picked out experience and the about summarization, where the recruiter worked and studied; make a message
            finalPrompt = "You are a job seeker planning to reach out to a job recruiter." + aboutSummarization + " They work as a " + recruiters[i].recruiter_current_job_title + " at " + recruiters[i].recruiter_current_job_company + ". They have education:" + recruiters[i].recruiter_education + ".\n Write a concise but genuine greeting to send over LinkedIn DM. Begin the message with \"Hi " + fullName[0] + ",\" (no further intro), then express your interst in something specific about the recruiter or the company stands out to you as a job seeker interested in working at their company. End with asking to connect and to have a conversation with them about potential job opportunities. The message should be concise (300 CHARACTERS OR LESS) but genuine and personal, AND IN COMPLETE SENTENCES WITH CORRECT GRAMMAR. You are " + name[0] + " " + name[1] + "; studying " + major + " at " + school + ", and are working at " + jobCompany + " as a " + jobTitle + ". Use this example if needed as a means of impressing or connecting the recruiter, modify as needed: " + comparisonToResume;

        }else{//IF NO ABOUT SECTION
            //use status, tagline, current job, education, location
            let statusTagSummarization = await newPrompt(openAIClient, "You are trying to make an impression on a recruiter. You can see their status on Linkedin:" + recruiters[i].recruiter_status + " - " + recruiters[i].recruiter_tagline + ": Summarize in 1-2 sentences: What skills/qualifications do you predict that are they looking for, given the information you have?");
            console.log("\nStatus and Tagline Summarization: " + statusTagSummarization);

            //compare about summarization to resume - pick out an experience
            let comparisonToResume = await newPrompt(openAIClient, "Consider " + name[0] + " " + name[1] + "'s Resume:" + resume + "\n\n Pick something from their resume to connect to something SPECIFIC that the recruiter values." + statusTagSummarization + " What is the best way to impress this recruiter, given my resume? Did we go to the same school? What experiences, projects, education or skills do I have that could help? Respond in one CONCISE sentence.");
            console.log("Comparison to Resume: " + comparisonToResume);

            //given picked out experience and the about summarization, where the recruiter worked and studied; make a message
            finalPrompt = "You are a job seeker planning to reach out to a job recruiter." + statusTagSummarization + " They work as a " + recruiters[i].recruiter_current_job_title + " at " + recruiters[i].recruiter_current_job_company + ". They have education:" + recruiters[i].recruiter_education + ".\n Write a concise but genuine greeting to send over LinkedIn DM. Begin the message with \"Hi " + fullName[0] + ",\" (no further intro), then express your interst in something specific about the recruiter or the company stands out to you as a job seeker interested in working at their company. End with asking to connect and to have a conversation with them about potential job opportunities. The message should be concise (300 CHARACTERS OR LESS) but genuine and personal, AND IN COMPLETE SENTENCES WITH CORRECT GRAMMAR. You are " + name[0] + " " + name[1] + "; studying " + major + " at " + school + ", and are working at " + jobCompany + " as a " + jobTitle + ". Use this example if needed as a means of impressing or connecting the recruiter, modify as needed: " + comparisonToResume;
        }

        let message = await newPrompt(openAIClient, finalPrompt);
        console.log("Final Message: " + message);
        outputJSONS.push(convertToFinishedRecruiterObject(recruiters[i].recruiter_name, recruiters[i].recruiter_location, recruiters[i].recruiter_linkedin, 
        recruiters[i].recruiter_about, recruiters[i].recruiter_education, recruiters[i].recruiter_current_job_title, recruiters[i].recruiter_current_job_company, recruiters[i].recruiter_tagline, 
        recruiters[i].recruiter_status, recruiters[i].search_query, message));
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

function convertToFinishedRecruiterObject(recruiterName, recruiterLocation, recruiterLinkedIn, recruiterAbout, recruiterEducation, recruiterJobTitle, recruiterJobCompany, 
    recruiterTagline, recruiterStatus, searchQuery, recruiterMessage){
   return {
    recruiter_name: recruiterName || '',
    recruiter_location: recruiterLocation || '',
    recruiter_linkedin: recruiterLinkedIn || '',
    recruiter_about: recruiterAbout || '',
    recruiter_education: recruiterEducation || '',
    recruiter_job_title: recruiterJobTitle || '',
    recruiter_job_company: recruiterJobCompany || '',
    recruiter_tagline: recruiterTagline || '',
    recruiter_status: recruiterStatus || '',
    search_query: searchQuery || '',
    recruiter_message: recruiterMessage || ''
   };
}