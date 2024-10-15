const fs = require('fs');

(async () => {
    let keyPhrase = "Thurman";
    
    const data = fs.readFileSync('recruiters.json', 'utf8');//load recruiter json
    const recruiters = JSON.parse(data);//read from json

    let selectedRecruiters = getSelectedRectruiters(keyPhrase.toLowerCase(), recruiters);//GET SELECTED RECRUITERS

    const jsonString = JSON.stringify(selectedRecruiters, null, 2);//WRITE TO FILE
    fs.writeFile('selected-recruiters.json', jsonString, (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('File successfully written!');
    }
    });
})();

function getSelectedRectruiters(keyPhrase, recruiters){
    let selectedRecruiters = [];
    for(const recruiter of recruiters){
        if(recruiter.recruiter_name.toLowerCase().includes(keyPhrase) || recruiter.recruiter_location.toLowerCase().includes(keyPhrase) || recruiter.recruiter_linkedin.toLowerCase().includes(keyPhrase) || 
        recruiter.recruiter_email.toLowerCase().includes(keyPhrase) || recruiter.recruiter_profile_picture.toLowerCase().includes(keyPhrase) || recruiter.recruiter_about.toLowerCase().includes(keyPhrase) || 
        recruiter.recruiter_education.toLowerCase().includes(keyPhrase) || recruiter.recruiter_current_job_title.toLowerCase().includes(keyPhrase) || recruiter.recruiter_current_job_company.toLowerCase().includes(keyPhrase) ||
        recruiter.recruiter_tagline.toLowerCase().includes(keyPhrase) || recruiter.recruiter_status.toLowerCase().includes(keyPhrase) || recruiter.search_query.toLowerCase().includes(keyPhrase))
            selectedRecruiters.push(recruiter);
    }
    return selectedRecruiters;
}