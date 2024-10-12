const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

})();

function convertToRecruiterObject(recruiterName, recruiterLocation, recruiterLinkedIn, recruiterAbout, recruiterEducation, recruiterTagline, recruiterStatus){
   return {
    recruiter_name: recruiterName || '',
    recruiter_location: recruiterLocation || '',
    recruiter_linkedin: recruiterLinkedIn || '',
    recruiter_about: recruiterAbout || '',
    recruiter_education: recruiterEducation || '',
    recruiter_tagline: recruiterTagline || '',
    recruiter_status: recruiterStatus || ''
   };
 }
