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
            await page.waitForSelector('.reusable-search__entity-result-list > .reusable-search__result-container', { timeout: 60000 });//wait for list to load - time to type in password
        }catch(error){}
        
        const recruiters = await page.$$('.list-style-none > .reusable-search__result-container');
        for(const recruiter of recruiters){
            let doNotAdd = false;
            let name = undefined;
            let location = undefined;
            let status = undefined;
            let recruiterLinkedin = undefined;
            let recruiterEmail = undefined;
            let recruiterProfilePicture = undefined;
            let recruiterAbout = undefined;
            let recruiterEducation = undefined;
            let recruiterCurrentJobTitle = undefined;
            let recruiterCurrentJobCompany = undefined;
            let recruiterTagline = undefined;
            let searchQuery = title;
            //STATUS
            try{
                let curRecruiter = await recruiter.$(".entity-result__summary")
                let statusTemp = await recruiter.evaluate(el => el.innerText.trim(), curRecruiter);
                statusTemp = statusTemp.split("\n");
                for(const item of statusTemp){
                    if(item.includes("Current") && (item.includes("Recruiter") || item.includes("recruiter") || item.includes("RECRUITER")))
                        status = item;
                }

                if(!status)//if not a current recruiter
                    doNotAdd = true;
            }catch(error){console.log("Error in STATUS fetch: " + error);}
            //END STATUS

            //LINKEDIN LINK
            try{
                recruiterLinkedin = await recruiter.$$eval('.entity-result__title-text a', links => links.length > 0 ? links[0].href : null);

                if(!recruiterLinkedin.includes("/in/"))
                    doNotAdd = true;
            }catch(error){console.log("Error in LINKEDIN LINK fetch: " + error);}
            //END LINKEDIN LINK

            if(!doNotAdd){//if "good" recruiter, visit their page and get more data - name, location, about, tagline, education, experience
                await profilePage.goto(recruiterLinkedin);
                await profilePage.waitForSelector('.text-body-medium', { timeout: 10000 });//wait for page load

                //LINKEDIN LINK UPDATE
                recruiterLinkedin = profilePage.url();
                //END LINKEDIN LINK UPDATE

                //NAME
                try{
                    name = await profilePage.evaluate(() => {
                        let nameLocContainers = document.querySelectorAll(".CJcpJShEPtvFSCHsalxWzNixdIdoEAqbWA");
                        return nameLocContainers[0].querySelector('span').innerText.trim();//first span in second element
                    });
                }catch(error){console.log("Error in NAME fetch: " + error);}
                //END NAME

                //LOCATION
                try{
                    location = await profilePage.evaluate(() => {
                        let nameLocContainers = document.querySelectorAll(".CJcpJShEPtvFSCHsalxWzNixdIdoEAqbWA");
                        return nameLocContainers[1].querySelector('span').innerText.trim();//first span in second element
                    });
                }catch(error){console.log("Error in LOCATION fetch: " + error);}
                //END LOCATION

                //PROFILE PICTURE (PFP)
                try{
                    recruiterProfilePicture = await profilePage.evaluate(() => {
                        return document.querySelector(".pv-top-card-profile-picture__image--show").getAttribute("src");
                    });
                    if(recruiterProfilePicture.includes("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"))//if no pfp
                        recruiterProfilePicture = undefined;
                }catch(error){console.log("Error in PROFILE PICTURE (PFP) fetch: " + error);}

                //TAGLINE
                let element = await recruiter.$(".text-body-medium");
                let recruiterData = await recruiter.evaluate(el => el.textContent.trim().replaceAll("\n", "").replaceAll("\t", ""), element);
                recruiterData = recruiterData.split("  ").filter(str => /\w+/.test(str));//split and remove empty strings
                recruiterTagline = recruiterData[4];
                await profilePage.waitForSelector('.UdDPsqOvTPDMZSLBZaNGGxyBXqSNkBQClL', { visible: true, timeout: 3000 });
                //END TAGLINE

                //ABOUT
                try{
                    recruiterAbout = await profilePage.evaluate(() => {
                    const sections = document.querySelectorAll('section[data-view-name="profile-card"]');//grab all sections
                    let aboutSection = null;
                    for(const section of sections){
                        if(section.querySelector('div')?.id == "about"){
                            aboutSection = section;
                        }
                    }
                    if(!aboutSection) return null;
                    
                    let output = aboutSection.querySelector('.QPriypoPxOFvmnjsoqRxkXeeNBXMwoasTM');
                    
                    return output.innerText.trim() || null;
                    });
                }catch(error){console.log("Error in ABOUT fetch: " + error);}
                //END ABOUT

                //START EDUCATION
                try{
                    recruiterEducation = await profilePage.evaluate(() => {
                    const sections = document.querySelectorAll('section[data-view-name="profile-card"]');//grab all sections
                    let educationSection = null;
                    for(const section of sections){
                        if(section.querySelector('div')?.id == "education"){
                            educationSection = section;
                        }
                    }
                    if(!educationSection) return null;
                            
                    let experiences = educationSection.querySelectorAll('li');
                    if(experiences.length == 0) return null;
        
                    let title = experiences[0].querySelector('span')?.innerText;
                    let degree = experiences[0].querySelector('.t-14')?.innerText;
                    let output = undefined;

                    if(degree)
                        output = degree + " at " + title;
                    else
                        output = title;

                    if(degree.includes(" - 20") || degree.includes(" - 19")){//check subheading - if it is a year
                        output = title;
                    }
                    output = output.split("\n").pop();
                    return output || null;
                    });
                }catch(error){console.log("Error in EDUCATION fetch: " + error);}
                //END EDUCATION

                //FIRST JOB EXPERIENCE LISTED
                try{
                    let recruiterCurrJobData = await profilePage.evaluate(() => {
                    const sections = document.querySelectorAll('section[data-view-name="profile-card"]');//grab all sections
                    let experienceSection = null;
                    for(const section of sections){
                        if(section.querySelector('div')?.id == "experience"){
                            experienceSection = section;
                        }
                    }
                    if(!experienceSection) return null;
                        
                    let experiences = experienceSection.querySelectorAll('li');
                    if(experiences.length == 0) return null;

                    let x = experiences[0].querySelector('span')?.innerText;
                    let y = experiences[0].querySelector('.t-14')?.innerText;
                    let output = undefined;
                    if(y.includes("Full-time · ") || y.includes("yrs") || y.includes("mos")){//check subheading
                        y = experiences[0].querySelectorAll(".t-bold")[1]?.innerText;
                        x = x.split(" · ").pop();
                        y = y.split(" · ").pop();
                        x = x.split("\n").shift();
                        y = y.split("\n").shift();
                        output = [y, x];
                    }else{
                        x = x.split(" · ").shift();
                        y = y.split(" · ").shift();
                        x = x.split("\n").shift();
                        y = y.split("\n").shift();
                        output = [x, y];
                    }
                    return output || null;
                    });
                    recruiterCurrentJobTitle = recruiterCurrJobData[0];
                    recruiterCurrentJobCompany = recruiterCurrJobData[1];
                }catch(error){console.log("Error in EXPERIENCE fetch: " + error);}
                //END FIRST JOB EXPERIENCE LISTED

                //EMAIL
                try{
                    await profilePage.goto(recruiterLinkedin + "overlay/contact-info/");
                    await profilePage.waitForSelector('.GbOUqgsXcLRctkckezmvfytZoHiNtpjNMicbM', { timeout: 10000 });//wait for page load
                    recruiterEmail = await profilePage.evaluate(() => {
                        let headings = document.querySelectorAll(".pv-contact-info__header");
                        let emailHeading = undefined;
                        for(const heading of headings){
                            if(heading.innerText == "Email")
                            emailHeading = heading;
                        }
                        if(!emailHeading)
                            return null;
                        return emailHeading.nextElementSibling.querySelector("a").href || null;
                    });
                }catch(error){console.log("Error in EMAIL fetch: " + error);}
                //END EMAIL

            }//END if !doNotAdd
            
            //ADD RECRUITER
            if(!doNotAdd){
                recruiterList.push(convertToRecruiterObject(name, location, recruiterLinkedin, recruiterEmail,recruiterProfilePicture,recruiterAbout, recruiterEducation, recruiterCurrentJobTitle, recruiterCurrentJobCompany,
                recruiterTagline, status, searchQuery));
                totalRecruiters++;
                console.log("Recruiters: " + recruiterList.length);
            }
        }
        console.log("Done with " + title);
        recruiterList = removeDuplicateRecruiters(recruiterList);
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

function convertToRecruiterObject(recruiterName, recruiterLocation, recruiterLinkedIn, recruiterEmail ,recruiterProfilePicture, recruiterAbout, recruiterEducation, recruiterCurrentJobTitle, recruiterCurrentJobCompany,
    recruiterTagline, recruiterStatus, searchQuery){
   return {
    recruiter_name: recruiterName || '',
    recruiter_location: recruiterLocation || '',
    recruiter_linkedin: recruiterLinkedIn || '',
    recruiter_email: recruiterEmail || '',
    recruiter_profile_picture: recruiterProfilePicture || '',
    recruiter_about: recruiterAbout || '',
    recruiter_education: recruiterEducation || '',
    recruiter_current_job_title: recruiterCurrentJobTitle || '',
    recruiter_current_job_company: recruiterCurrentJobCompany || '',
    recruiter_tagline: recruiterTagline || '',
    recruiter_status: recruiterStatus || '',
    search_query: searchQuery || ''
   };
}

function removeDuplicateRecruiters(recruiters) {
    const uniqueNames = new Set();
    const filteredRecruiters = [];

    for (const recruiter of recruiters) {
        if (!uniqueNames.has(recruiter.recruiter_name)) {
            uniqueNames.add(recruiter.recruiter_name);
            filteredRecruiters.push(recruiter);
        }
    }

    return filteredRecruiters;
}