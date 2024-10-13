const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const jobTitles = [
        "Software Development",
        "Mobile App Development",
        "Data Science",
        "Machine Learning",
        "Artificial Intelligence",
        "Cybersecurity",
        "Network Engineering",
        "Systems Administration",
        "Database Administration",
        "Cloud Computing",
        "DevOps",
        "IT Support",
        "QA Testing",
        "Game Development",
        "UI/UX Design",
        "Full Stack Development",
        "Frontend Development",
        "Backend Development",
        "Blockchain Development",
        "Robotics Engineering",
        "Software Engineering",
        "Bioinformatics",
        "Computer Vision",
        "Natural Language Processing",
        "Embedded Systems",
        "IT Consulting",
        "Tech Support",
        "Product Management",
        "Research and Development",
        "Data Analysis",
        "Product Manager", "Software Engineer", "Full Stack Developer", "Backend Developer", "Frontend Developer", "DevOps Engineer", "Mobile App Developer",
        "Flight Test Engineer",
        "Machine Learning Engineer", "Data Scientist", "AI Engineer",
        "Biomedical Engineer",
        "UI Designer", "UX Designer",
        "IT Support Specialist", "Network Administrator", "Systems Analyst", "Database Administrator", "Cybersecurity Analyst",   "Junior Software Developer",
        "Associate Software Engineer",
        "Technical Support Engineer",
        "IT Specialist",
        "Junior Data Analyst",
        "Junior DevOps Engineer",
        "Entry-Level QA Engineer",
        "Junior System Administrator",
        "Junior Network Engineer",
        "IT Technician",
        "Junior Cybersecurity Analyst",
        "Help Desk Technician",
        "Technical Support Analyst",
        "Cloud Support Associate",
        "Junior Web Developer",
        "Junior Mobile Developer",
        "Junior Backend Engineer",
        "Junior Frontend Engineer",
        "Junior Database Developer",
        "Junior IT Consultant",
        "Entry-Level Data Scientist"  
    ]

    //OPEN BROWSER
    const browser = await puppeteer.launch({ headless: false, defaultViewport: false, userDataDir: "./tmp"});//launch browser
    const profilePage = await browser.newPage();
    const page = await browser.newPage();//new page/tab in browser
    page.setViewport({width: 1920, height: 1080});
    let totalRecruiters = 0;
    //END OPEN BROWSER


    for(const title of jobTitles){
        //OPEN PAGE
        await page.goto("https://www.linkedin.com/search/results/people/?keywords=" + title + " Recruiter&origin=GLOBAL_SEARCH_HEADER&sid=8V)");
        //await new Promise(r => setTimeout(r, 2000));//extra time for page to load

        try{
            await page.waitForSelector('.reusable-search__entity-result-list > .reusable-search__result-container', { timeout: 15000 });
        }catch(error){}
        
        const recruiters = await page.$$('.list-style-none > .reusable-search__result-container');
        for(const recruiter of recruiters){
            let name = "undefined";
            let location = "undefined";
            let status = "undefined";
            let recruiterLinkedin = "undefined";
            let recruiterAbout = "undefined";
            let recruiterEducation = "undefined";
            let recruiterTagline = "undefined";
            let searchQuery = title;
            try{
                let element = await recruiter.$(".entity-result__title-text > .app-aware-link > span > span");
                let recruiterData = await recruiter.evaluate(el => el.textContent.trim().replaceAll("\n", "").replaceAll("\t", ""), element);//remove most whitespace
                recruiterData = recruiterData.split("  ").filter(str => /\w+/.test(str));//split and remove empty strings
                if(recruiterData.length > 2){//if not a linkedin hidden member
                    name = recruiterData[1].split("View").pop();
                    name = name.replace("’s profile", "");
                    location = recruiterData[5];
                    status = recruiterData[6];
                }
            }catch(error){}
            try{
                if(status.includes("Current")){//if they are CURRENTLY a recruiter
                    const clickable = await recruiter.$('.display-flex');
                    if (clickable) {
                        console.log("clicking");
                        await new Promise(r => setTimeout(r, 2000));//extra time for page to load
                        await clickable.click();
                    }
                    try{
                        await page.waitForSelector('.text-body-medium', { timeout: 15000 });
                        let element = await recruiter.$(".text-body-medium");
                        let recruiterData = await recruiter.evaluate(el => el.textContent.trim().replaceAll("\n", "").replaceAll("\t", ""), element);
                        recruiterData = recruiterData.split("  ").filter(str => /\w+/.test(str));//split and remove empty strings
                        recruiterTagline = recruiterData[4];
                        recruiterStatus = recruiterData[6];

                    }catch(error){}
                    
                    await page.goBack();//go back when done
                    //visit their page, grab tagline, about, url, education, update status with current first listed experience
                }
            }catch(error){}
            //console.log("Name: " + name + "\tLocation: " + location + "\tStatus: " + status + "\n");
        }
    }

    console.log("done");

})();

function convertToRecruiterObject(recruiterName, recruiterLocation, recruiterLinkedIn, recruiterAbout, recruiterEducation, recruiterTagline, recruiterStatus, searchQuery){
   return {
    recruiter_name: recruiterName || '',
    recruiter_location: recruiterLocation || '',
    recruiter_linkedin: recruiterLinkedIn || '',
    recruiter_about: recruiterAbout || '',
    recruiter_education: recruiterEducation || '',
    recruiter_tagline: recruiterTagline || '',
    recruiter_status: recruiterStatus || '',
    search_query: searchQuery || ''
   };
 }
