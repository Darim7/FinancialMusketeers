import requests
from bs4 import BeautifulSoup
import yaml

# Making a GET request
r = requests.get('https://www.irs.gov/filing/federal-income-tax-rates-and-brackets')

# check status code for response received
# success code - 200
if r.status_code == 200:
    # Parsing the HTML
    soup = BeautifulSoup(r.content, 'html.parser')
    # print(soup.prettify())

    data = []
    table = soup.find('table')

    # PT: Can you write me a python script using beautifulsoup to scrape the federal tax brackets?
    # Extract the table headers
    headers = [header.text.strip() for header in table.find_all('th')]

    # Extract the table rows
    rows = []
    for row in table.find_all('tr')[1:]:  # Skip the header row
        rows.append([cell.text.strip() for cell in row.find_all('td')])

    print(headers)
    print(rows)
else:
    print("Failed to make request :(")

def extract_table():
    """
    Parse the table received from the website.
    """

def read_tax():
    """
    Read a Yaml file that has the tax info.
    """

def save():
    """
    Saves the scraped tax information to a Yaml file.
    """

def scrape_tax(url: str, state: str, isSingle: bool) -> list[tuple[float, float]]:
    """
    Hello!
    """
    # Check if there is a yaml file that is saved.

    # Make a request to the website.

    # Process tables according to the filing status.

    # Save yaml to the folder.

    return [(-1, -1)]
