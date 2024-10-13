#!/bin/bash

keyphrase="Software Developer"

#run js file
echo "Running recruiter-info.js with the key phrase: $keyphrase"
node recruiter-info.js "$keyphrase"

#run py file
echo "Running keyword.py with the key phrase: $keyphrase"
python keyword.py "$keyphrase"
