import sys
import pandas as pd
from sentence_transformers.cross_encoder import CrossEncoder

# Check if the keyphrase argument is passed from the command line
if len(sys.argv) > 1:
    keyphrase = sys.argv[1]
else:
    print("Error: No keyphrase provided.")
    sys.exit(1)

# Load the data from the JSON file
df = pd.read_json('example.json')

# Create a new column 'profile_text' by joining relevant recruiter fields
df['profile_text'] = df[['recruiter_name', 'recruiter_about', 'recruiter_tagline', 'recruiter_education', 'recruiter_linkedin', 'recruiter_currentjob']].apply(lambda row: ' '.join(row.values.astype(str)), axis=1)

# List of profile texts for comparison
profiles = df['profile_text'].tolist()

def get_synonyms(word):
    #Find exact matches in the 'profile_text'
    matches = df[df['profile_text'].str.contains(word, case=False, na=False)]
    
    if not matches.empty:
        # If matches are found, return selected recruiter details
        return matches[['recruiter_name', 'recruiter_location', 'recruiter_education', 'recruiter_tagline', 'recruiter_linkedin', 'recruiter_currentjob']]

    print(f"No exact match found for '{word}'. Searching for similar terms...")

    # Load the cross-encoder model for similarity scoring
    model = CrossEncoder("cross-encoder/stsb-distilroberta-base")

    # Create pairs of the keyphrase and each profile text
    input_pairs = [[word, profile] for profile in profiles]

    # Calculate similarity scores
    scores = model.predict(input_pairs)

    # Add similarity scores to the dataframe
    df['similarity_score'] = scores

    # Sort by similarity score and take top 15 matches
    top_matches = df.sort_values(by='similarity_score', ascending=False).head(15)
    
    # Save it to a JSON file and return the result
    result = top_matches[['recruiter_name', 'recruiter_location', 'recruiter_education', 'recruiter_tagline', 'recruiter_linkedin', 'recruiter_currentjob']]
    result.to_json('keyword.json', orient='records', lines=True)
    return result

# Call the function with the keyphrase and get the results
get_synonyms(keyphrase)
