import asyncio
import sqlite3
from playwright.async_api import async_playwright
from datetime import datetime
from PIL import Image
from io import BytesIO

# Connect to the SQLite database
conn = sqlite3.connect('urls.db')
cursor = conn.cursor()

# Check if the 'image' column exists in the 'url' table
cursor.execute("PRAGMA table_info(url)")
columns = cursor.fetchall()
if 'image' not in [column[1] for column in columns]:
    # Add the 'image' column to the 'url' table
    cursor.execute('ALTER TABLE url ADD COLUMN image BLOB')

# Check if the 'captured_date' column exists in the 'url' table
if 'captured_date' not in [column[1] for column in columns]:
    # Add the 'captured_date' column to the 'url' table
    cursor.execute('ALTER TABLE url ADD COLUMN captured_date TEXT')

# Check if the 'status_code' column exists in the 'url' table
if 'status_code' not in [column[1] for column in columns]:
    # Add the 'status_code' column to the 'url' table
    cursor.execute('ALTER TABLE url ADD COLUMN status_code INTEGER')

# Check if the 'url_redirected' column exists in the 'url' table
if 'url_redirected' not in [column[1] for column in columns]:
    # Add the 'url_redirected' column to the 'url' table
    cursor.execute('ALTER TABLE url ADD COLUMN url_redirected TEXT')


# Function to capture the webpage image using Playwright
async def capture_webpage_image(url):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_viewport_size({'width': 800, 'height': 600})  # Set viewport size
        try:
            response = await page.goto(url, wait_until='networkidle', timeout=60000)  # Increase timeout to 60 seconds
            status_code = response.status
            final_url = response.url
            screenshot = await page.screenshot(full_page=True) if status_code < 400 or status_code >= 600 else None
        except Exception as e:
            print(f"Error capturing webpage for URL: {url}. Error: {str(e)}")
            status_code = 0
            final_url = url
            screenshot = None
        finally:
            await browser.close()
        return screenshot, status_code, final_url


# Function to process URLs and capture webpage images
async def process_urls():
    # Retrieve all URLs from the 'url' table
    cursor.execute('SELECT id, url FROM url')
    urls = cursor.fetchall()

    # Create a semaphore to limit the number of concurrent browsers
    semaphore = asyncio.Semaphore(5)  # Adjust the number as needed

    async def process_url(url_id, url):
        async with semaphore:
            print(f"Processing URL: {url}")
            image_data, status_code, final_url = await capture_webpage_image(url)

            captured_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            if status_code < 400 or status_code >= 600:
                try:
                    # Convert PNG to WebP and reduce quality
                    image = Image.open(BytesIO(image_data))
                    output = BytesIO()
                except Exception as e:
                    print(f"Error transforming image for URL: {url}. Error: {str(e)}")
                    return

                max_retries = 3
                retry_count = 0
                while retry_count < max_retries:
                    try:
                        image.save(output, format='WebP', quality=50)
                        break
                    except Exception as e:
                        print(f"Error saving image for URL: {url}. Error: {str(e)}")
                        retry_count += 1
                        if retry_count == max_retries:
                            print(f"Max retries reached for URL: {url}. Skipping...")
                            return

                image_data = output.getvalue()
                cursor.execute(
                    'UPDATE url SET image = ?, captured_date = ?, status_code = ?, url_redirected = ? WHERE id = ?',
                    (image_data, captured_date, status_code, final_url, url_id))
            else:
                cursor.execute('UPDATE url SET captured_date = ?, status_code = ?, url_redirected = ? WHERE id = ?',
                               (captured_date, status_code, final_url, url_id))

            conn.commit()
            print(f"URL processed: {url} (Status Code: {status_code}, Redirected URL: {final_url})")

    # Process URLs concurrently
    tasks = []
    for url_id, url in urls:
        task = asyncio.create_task(process_url(url_id, url))
        tasks.append(task)

    await asyncio.gather(*tasks)


# Run the URL processing asynchronously
asyncio.run(process_urls())

# Close the database connection
conn.close()