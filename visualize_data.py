import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
import re
df = pd.read_json('example.json')


df_grouped = df.groupby(['recruiter_education', 'recruiter_location']).size().reset_index(name='count')

df_top10 = df_grouped.sort_values(by='count', ascending=False).head(7)

df_top10['count'] = df_top10['count'].astype(int)

# Plot the top 10 most common combinations of recruiter education and location
plt.figure(figsize=(12, 8))
sns.barplot(x='count', y='recruiter_education', hue='recruiter_location', data=df_top10)
plt.title('Top 10 Most Common Recruiter Education and Locations')
plt.xlabel('Count')
plt.ylabel('Recruiter Education')
plt.legend(title='Location', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.show()
