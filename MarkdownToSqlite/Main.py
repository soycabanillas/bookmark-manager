import os
import re
import sqlite3

# Regular expression pattern for matching URLs and optional titles
url_pattern = re.compile(r'(https?://\S+)\)')
title_pattern = re.compile(r'\[(.+?)\]')

# Connect to the SQLite database (it will be created if it doesn't exist)
conn = sqlite3.connect('urls.db')
cursor = conn.cursor()

# Create the 'url' table if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS url (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        domain TEXT,
        title TEXT
    )
''')


# Function to extract the main domain from a URL
def get_main_domain(url):
    domain_pattern = re.compile(r'https?://(?:www\.)?([^/]+)')
    match = domain_pattern.match(url)
    if match:
        return match.group(1)
    return ''


# Process each Markdown file
directory = "C:\\Users\\alejandro\\Documents\\Main\\Links"
for filename in os.listdir(directory):
    if filename.endswith('.md'):
        with open(directory + "\\" + filename, 'r', encoding='utf-8') as file:
            content = file.readlines()

            # Process each line in the Markdown file
            for line in content:
                line = line.strip()

                # Check if the line contains a URL
                url_match = url_pattern.search(line)
                if url_match:
                    url = url_match.group(1)

                    # Check if the line contains a title in square brackets
                    title_match = title_pattern.search(line)
                    if title_match:
                        title = title_match.group(1)
                    else:
                        title = ''

                    # Extract the main domain from the URL
                    domain = get_main_domain(url)

                    # Insert the URL, domain, and title into the database
                    cursor.execute('INSERT INTO url (url, domain, title) VALUES (?, ?, ?)', (url, domain, title))
                elif line.strip():
                    # Print the line that doesn't contain a URL
                    print(f"Line without URL: {line}")

# Commit the changes and close the database connection
conn.commit()
conn.close()