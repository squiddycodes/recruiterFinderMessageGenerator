import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'; // Assuming you are using Material-UI
import './App.css';
import RecruiterCard from './card';
import jsonData from './example.json';
import AspectRatio from '@mui/joy/AspectRatio';


const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(jsonData); // Load the JSON data into state
  }, []);

  return (
    
        <Grid container display="flex" justifyContent="space-between" alignItems="center" spacing={{ xs: 8, md: 10 , lg:12 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {data.map((recruiter, index) => (
            < item key={index}>
              {console.log(recruiter)}
              <RecruiterCard
                key={index}
                name={recruiter.recruiter_name}
                location={recruiter.recruiter_location}
                linkedin={recruiter.recruiter_linkedin}
                about={recruiter.recruiter_about}
                education={recruiter.recruiter_education}
                currentJob={recruiter.recruiter_currentjob}
                tagline={recruiter.recruiter_tagline}
                status={recruiter.recruiter_status}
              />
            </item>
          ))}
        </Grid>

  );
}

export default App;
