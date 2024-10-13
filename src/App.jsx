import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'; // Assuming you are using Material-UI
import './App.css';
import RecruiterCard from './card';
import jsonData from './example.json';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(jsonData); // Load the JSON data into state
  }, []);

  return (
    <>
      <div>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {data.map((recruiter, index) => (
            < item >
              {console.log(recruiter)}
              <RecruiterCard
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
      </div>
    </>
  );
}

export default App;
