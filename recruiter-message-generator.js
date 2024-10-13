const OpenAI = require('openai');
const fs = require('fs');
require("dotenv").config();

(async () => {
    //INIT OPENAI MODEL
    const openAIClient = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY']
    });
    //END INIT OPENAI MODEL 

    const data = fs.readFileSync('selected-recruiters.json', 'utf8');//load resume json
    const recruiters = JSON.parse(data);

    let outputMessages = [];
    let prompt = "Using the following information:Client's Resume (containing the client’s skills, experiences, education, and other relevant details) Job Description (which specifies the role’s requirements, key responsibilities, and qualifications) Recruiter's Information (recruiter name, location, LinkedIn profile, about section, education, tagline, and company details) Write a concise LinkedIn message that:Starts with a friendly greeting and the recruiter's name. Introduces the client, focusing only on the most relevant skills and experiences that match the job description. Makes a direct connection between the client’s experience and the key qualifications or requirements from the job description. References something specific about the recruiter or company that demonstrates genuine interest.Ends with a polite call to action (e.g., requesting to connect or discuss further) and a friendly sign-off.Ensure the message is conversational but direct, highlighting the strongest fit between the client and the job role in a concise way.";
    console.log(recruiters[1].recruiter_location);
    //console.log(await newPrompt(openAIClient, "Describe penn state in 5 words"));
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