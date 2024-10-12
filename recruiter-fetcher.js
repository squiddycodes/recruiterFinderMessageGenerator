const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

})();

function convertToRecruiterObject(recruiterName, recruiterLocation, recruiterLinkedIn, recruiterAbout, recruiterEducation, recruiterTagline, recruiterStatus){
   return {
     recruiter_name : recruiterName || '',
     recruiterLocation : recruiterLocation || '',
   };
 }
