import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


df = pd.read_json('https://raw.githubusercontent.com/squiddycodes/recruiterFinderMessageGenerator/refs/heads/main/example.json')

df_grouped = df.groupby(['recruiter_education', 'recruiter_location']).size().reset_index(name='count')

# Sort by count to get the top combinations
df_top10 = df_grouped.sort_values(by='count', ascending=False).head(7)

# Plot the most common combinations of recruiter education and location
plt.figure(figsize=(24, 16))
sns.barplot(x='count', y='recruiter_education', hue='recruiter_location', data=df_top10)
plt.title('Top 7 Most Common Recruiter Education and Locations')
plt.xlabel('Count')
plt.ylabel('Recruiter Education')
plt.legend(title='Location', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.show()
