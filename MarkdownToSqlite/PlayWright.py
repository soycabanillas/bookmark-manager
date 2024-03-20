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

if 'thumbnail' not in [column[1] for column in columns]:
    # Add the 'thumbnail' column to the 'url' table
    cursor.execute('ALTER TABLE url ADD COLUMN thumbnail BLOB')

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
            screenshot = await page.screenshot(full_page=False) if status_code < 400 or status_code >= 600 else None
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

            max_retries = 3
            retry_count = 0
            successful_capture = False

            while retry_count <= max_retries and not successful_capture:
                image_data, status_code, final_url = await capture_webpage_image(url)
                captured_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                # Check if the capture is successful
                if image_data is not None:
                    successful_capture = True
                else:
                    # Determine if conditions for retry are met
                    if not (400 <= status_code < 600):
                        retry_count += 1
                        print(f"Retry {retry_count} for URL: {url}. Status Code: {status_code}")
                    else:
                        # If status code indicates a client error, do not retry
                        break

            if successful_capture:
                try:
                    # Convert PNG to WebP, reduce quality for the main image, and create thumbnail
                    image = Image.open(BytesIO(image_data))
                    output_main = BytesIO()
                    image.save(output_main, format='WebP', quality=50)
                    image_data_main = output_main.getvalue()

                    # Create and save the thumbnail
                    thumbnail_size = (200, 150)  # Maintain aspect ratio
                    image.thumbnail(thumbnail_size, Image.Resampling.LANCZOS)
                    output_thumb = BytesIO()
                    image.save(output_thumb, format='WebP', quality=50)
                    image_data_thumbnail = output_thumb.getvalue()

                except Exception as e:
                    print(f"Error processing image for URL: {url}. Error: {str(e)}")
                    return

                cursor.execute(
                    'UPDATE url SET image = ?, thumbnail = ?, captured_date = ?, status_code = ?, url_redirected = ? WHERE id = ?',
                    (image_data_main, image_data_thumbnail, captured_date, status_code, final_url, url_id))
            else:
                print(f"Failed to capture screenshot after {retry_count} retries for URL: {url}.")
                # Update the database with attempt details even if capture fails
                cursor.execute('UPDATE url SET captured_date = ?, status_code = ?, url_redirected = ? WHERE id = ?',
                               (captured_date, status_code, final_url, url_id))

            conn.commit()
            print(
                f"URL processed: {url} (Status Code: {status_code}, Redirected URL: {final_url}, Retries: {retry_count})")

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