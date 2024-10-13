from sentence_transformers.cross_encoder import CrossEncoder

df = pd.read_json('example.json')

df['profile_text'] = df[['recruiter_name', 'recruiter_about', 'recruiter_tagline', 'recruiter_education', 'recruiter_linkedin', 'recruiter_currentjob']].apply(lambda row: ' '.join(row.values.astype(str)), axis=1)

profiles = df['profile_text'].tolist()

def get_synonyms(word):

    matches = df[df['profile_text'].str.contains(word, case=False, na=False)]
    
    if not matches.empty:
        return matches[['recruiter_name', 'recruiter_location', 'recruiter_education', 'recruiter_tagline', 'recruiter_linkedin', 'recruiter_currentjob']]

    print(f"No exact match found for '{word}'. Searching for similar terms...")

    model = CrossEncoder("cross-encoder/stsb-distilroberta-base")

    input_pairs = [[word, profile] for profile in profiles]
    
    scores = model.predict(input_pairs)

    df['similarity_score'] = scores

    top_matches = df.sort_values(by='similarity_score', ascending=False).head(20)
    result = top_matches[['recruiter_name', 'recruiter_location', 'recruiter_education', 'recruiter_tagline', 'recruiter_linkedin', 'recruiter_currentjob']]

    # Save to JSON file
    return result.to_json('keyword.json', orient='records', lines=True)
