const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let recruiterList = [];
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
            let doNotAdd = false;
            let name = "undefined";
            let location = "undefined";
            let status = "undefined";
            let recruiterLinkedin = "undefined";
            let recruiterAbout = "undefined";
            let recruiterEducation = "undefined";
            let recruiterExperience = "undefined";
            let recruiterTagline = "undefined";
            let searchQuery = title;
            try{
                let element = await recruiter.$(".entity-result__title-text > .app-aware-link > span > span");
                let recruiterData = await recruiter.evaluate(el => el.textContent.trim().replaceAll("\n", "").replaceAll("\t", ""), element);//remove most whitespace
                recruiterData = recruiterData.split("  ").filter(str => /\w+/.test(str));//split and remove empty strings
                if(recruiterData.length > 2){//if not a linkedin hidden member
                    name = recruiterData[1].split("View").pop();
                    name = name.replace("’s profile", "");
                    name = name.replace(" ", "");
                    location = recruiterData[5];
                    status = recruiterData[6];
                    recruiterLinkedin = await recruiter.$$eval('.entity-result__title-text a', links => links.length > 0 ? links[0].href : null);
                    if(!recruiterLinkedin.includes("/in/"))
                        doNotAdd = true;
                }else
                    doNotAdd = true;
            }catch(error){}
            try{
                if(status.includes("Current")){//if they are CURRENTLY a recruiter
                    await profilePage.goto(recruiterLinkedin);
                    await profilePage.waitForSelector('.text-body-medium', { timeout: 15000 });
                    //visit their page, grab education, update status with current first listed experience
                    //TAGLINE & STATUS
                    let element = await recruiter.$(".text-body-medium");
                    let recruiterData = await recruiter.evaluate(el => el.textContent.trim().replaceAll("\n", "").replaceAll("\t", ""), element);
                    recruiterData = recruiterData.split("  ").filter(str => /\w+/.test(str));//split and remove empty strings
                    recruiterTagline = recruiterData[4];
                    recruiterStatus = recruiterData[6];
                    await profilePage.waitForSelector('.UdDPsqOvTPDMZSLBZaNGGxyBXqSNkBQClL', { visible: true, timeout: 3000 });
                }else
                    doNotAdd = true;
            }catch(error){}

            //START EXPERIENCE & ABOUT
            //GETS ALL AS ARRAY
            const profileSectionText = await profilePage.$$eval('.eMKzYTnovCkOQaNEgZiBMAzoRyZWLkSNRU', elements =>
                elements.map(element => element.textContent.trim())
            );
            try{
                await profilePage.waitForSelector('#about', { timeout: 100 });
                recruiterAbout = profileSectionText[0];
                recruiterExperience = profileSectionText[1];
            }catch(error){recruiterExperience = profileSectionText[0]}
            //END EXPERIENCE & ABOUT
                    
            //START EDUCATION
            try{
                await profilePage.waitForSelector('#education', { timeout: 100 });
                recruiterEducation = await profilePage.$eval('div > div > main > section:nth-child(6) > div.odrLHmBmKxJsahsMEDxzTVuSNTHKhMndqJow > ul > li:nth-child(1) > div > div.display-flex.flex-column.align-self-center.full-width > div > a > div > div > div > div > span:nth-child(1)', el => el.textContent.trim());
            }catch(error){}
            //END EDUCATION

            //ADD RECRUITER
            if(!doNotAdd){
                recruiterList.push(convertToRecruiterObject(name, location, recruiterLinkedin, recruiterAbout, recruiterEducation, recruiterExperience, 
                recruiterTagline, status, searchQuery));
                totalRecruiters++;
                console.log("Recruiters: " + totalRecruiters);
            }
        }
        console.log("Done with ");
        const jsonString = JSON.stringify(recruiterList, null, 2);
        fs.writeFile('recruiters.json', jsonString, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File successfully written!');
        }
        });
    }

    console.log("done");

})();

function convertToRecruiterObject(recruiterName, recruiterLocation, recruiterLinkedIn, recruiterAbout, recruiterEducation, recruiterExperience, 
    recruiterTagline, recruiterStatus, searchQuery){
   return {
    recruiter_name: recruiterName || '',
    recruiter_location: recruiterLocation || '',
    recruiter_linkedin: recruiterLinkedIn || '',
    recruiter_about: recruiterAbout || '',
    recruiter_education: recruiterEducation || '',
    recruiter_experience: recruiterExperience || '',
    recruiter_tagline: recruiterTagline || '',
    recruiter_status: recruiterStatus || '',
    search_query: searchQuery || ''
   };
 }
