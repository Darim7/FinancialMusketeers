import requests
from bs4 import BeautifulSoup


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
