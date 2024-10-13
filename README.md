# LinkedIn Recruiter Outreach Tool

This project automates the process of finding recruiters on LinkedIn, gathering key recruiter information, and generating personalized messages using AI. The system allows users to scrape recruiter profiles, search for recruiters based on job titles or industries, and generate custom messages tailored to each recruiter.

## Features

- **Automated Recruiter Info Collection**: Scrapes recruiter details such as name, LinkedIn profile URL, job roles, and additional profile info.
- **Job Search Filtering**: Users can search for recruiters based on specific job titles or industries.
- **AI-Powered Message Generation**: Uses AI to create personalized messages based on the user's resume and the recruiter's information.
- **Web Interface**: Includes a simple UI for users to input search terms and view recruiter information.

# How to use:
## Step 1: Retrieve recruiter data.

To retrieve the data, use the data fetcher file that will scrape LinkedIn for recruiters.
File: recruiter-fetcher.js

This file will return the result as a JSON file, which includes important information that will be vital for the generative AI to make a good message.

## Step 2: Filter the data (Optional)
To filter out the data you can use either the "recruiter-info.js" File or the "keyword.py" File. 

The "recruiter-info.js" File takes in 1 phrase as an argument and checks the "recruiter_status", "recruiter_about" and "recruiter_tagline" and checks if that phrase exists in ANY of those if it does, then it will return the objects that do have that as a JSON, (same format just filtering out those without the keyword). 

If you give it an argument that is more than one word (has a space), it will then check for those words and ensure anything that is in the JSON includes those words.

The "keyword.py" File works very similarly, however, the difference is that if the word DOES NOT EXIST, it uses an algorithm that checks for synonyms and checks how similar that word is to the target word. If it is similar enough, then it replaces that word with the synonym. Then it returns a new JSON that includes the synonym words + the target word. (example: target word: "AI Engineer", synonym word: "AI Developer")

## Step 3: Generating AI Messaging
This program uses the JSON and takes your resume, which then runs the prompt for the AI which generates a response catered to your resume / JSON info

## Step 4: UI
after acquiring the JSON file using the scraper tool and saving it in the project's src folder. Then, simply run npm run dev to run the site on your local device.



