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

    print(table)
else:
    print("Failed to make request :(")
