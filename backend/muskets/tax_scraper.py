import requests
from bs4 import BeautifulSoup
import yaml
from typing import List, Dict
import re

FEDERAL_INCOME_URL='https://www.irs.gov/filing/federal-income-tax-rates-and-brackets'
FEDERAL_CAP_GAINS_URL='https://www.irs.gov/taxtopics/tc409'
FEDERAL_DEDUCTIONS_URL='https://www.irs.gov/publications/p17#en_US_2024_publink1000283782'
NY_INCOME_URL="https://www.tax.ny.gov/forms/current-forms/it/it201i.htm#nys-tax-rate-schedule"
NJ_INCOME_URL="https://nj-us.icalculator.com/income-tax-rates/2024.html"
CT_INCOME_URL='https://ct-us.icalculator.com/income-tax-rates/2024.html'
def extract_value_from_dollar(dollar:str):
    dollar=dollar.replace(' ', '')
    dollar=dollar.replace('$', '')
    dollar=dollar.replace(",", '')
    dollar=dollar.replace(".00", '')
    return dollar
def extract_table(table):
    """
    Parse the table received from the website.
    return a tuple of table headers, and row
    """
    # Extract the table headers
    headers = [header.text.strip() for header in table.find_all('th')]

    # Extract the table rows
    rows = []
    for row in table.find_all('tr')[1:]:  # Skip the header row
        rows.append([cell.text.strip() for cell in row.find_all('td')])
    return (headers, rows)

def income_to_dict(rows:List):
    """ Takes in the table rows and convert to a dictionary for yaml

    Args:
        rows (List): table rows
    """
    income_rates={}
    for row in rows: 
        rate, lower, upper=row
        print(f"Rate: {rate}, Lower: {lower}, Upper: {upper}")
        if upper=="And up":
            upper="inf"
        upper=extract_value_from_dollar(upper)
        income_rates[upper]=rate
    print(f"Resulting Dict: {income_rates}")
    return income_rates

def cap_gains_to_dict(ulists:List, is_married:bool=False):
    cap_gain_rates={}
    zero_tax=[li.text.strip() for li in ulists[0].findAll('li')]
    fifteen_tax=[li.text.strip() for li in ulists[1].findAll('li')]

    # Extract income
    # Regex pattern to match all dollar amounts
    pattern = r"\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?"   

    zero_pct_matches = [re.findall(pattern, line) for line in zero_tax]
    fifteen_pct_matches = [re.findall(pattern, line) for line in fifteen_tax]

    zero_pct_matches = zero_pct_matches[:2]
    fifteen_pct_matches=fifteen_pct_matches[:2]
    index=0
    if is_married:
        index=1
    zero_value=extract_value_from_dollar(zero_pct_matches[index][0])
    fifteen_value=extract_value_from_dollar(fifteen_pct_matches[index][1])
    cap_gain_rates[zero_value]="0%"
    print(fifteen_pct_matches)
    cap_gain_rates[fifteen_value]="15%"
    cap_gain_rates["inf"]="20%"
    
    print(cap_gain_rates)
    return cap_gain_rates

def ny_income_to_dict(rows):
    income_dict={}
    for row in rows: 
        if len(row)==0:
            continue
        _, upper, _, _, rate, _,_=row
        upper=extract_value_from_dollar(upper)
        if upper=='----':
            upper='inf'
        income_dict[upper]=rate
    return income_dict

def icalculator_income_to_dict(rows):
    income_dict={}
    for row in rows: 
        if len(row)==0:
            continue
        rate, _, _, upper =row
        if upper=='and above':
            upper='inf'
        upper=extract_value_from_dollar(upper)
        income_dict[upper]=rate
    return income_dict
def read_tax(file_path:str):
    """
    Read a Yaml file that has the tax info.
    Returns a dictionary
    """
    with open(file_path, 'r') as file:
    # TODO To be implemented
        tax=yaml.safe_load(file)
    return tax
def save(to_yaml:Dict, to_dest:str):
    """
    Saves the scraped tax information to a Yaml file.
    """
    with open(to_dest, 'w') as file:
            yaml.dump(to_yaml, file, default_flow_style=False, sort_keys=False)

def scrape_state_tax(url: str, state: str, isSingle: bool) -> list[tuple[float, float]]:
    """
    Hello!
    """
    # Check if there is a yaml file that is saved.

    # Make a request to the website.

    # Process tables according to the filing status.

    # Save yaml to the folder.

    return [(-1, -1)]

def scrape_income_tax()->tuple[Dict, Dict]:
    """ Scrapes Income Tax. Returns individual and married income dictionary if found, else None

    Returns:
        tuple[Dict, Dict]: Individual Income Dict, Married Income Dict 
    """
    # Making a GET request
    r = requests.get(FEDERAL_INCOME_URL)    

    # check status code for response received
    # success code - 200
    if r.status_code == 200:
        # Parsing the HTML
        soup = BeautifulSoup(r.content, 'html.parser')
        # print(soup.prettify())    

        tables = soup.findAll('table')[:2]
        # PT: Can you write me a python script using beautifulsoup to scrape the federal tax brackets?
        _, rows =extract_table(tables[0])
        individual_income=income_to_dict(rows)
        _, rows=extract_table(tables[1])
        married_income=income_to_dict(rows)
        return (individual_income, married_income)
    else:
        print("Failed to make request :(")
        return None
        
def scrape_cap_gains_tax()->tuple[Dict, Dict]:
    """Scrapes federal capital gains tax. Returns individual and married captial gains dictionary if found, else None

    Returns:
        tuple[Dict, Dict]: (individual capital gains, married capital gains)
    """
    # Make GET Request
    r=requests.get(FEDERAL_CAP_GAINS_URL)
    if r.status_code==200:
        soup=BeautifulSoup(r.content, 'html.parser')
        ulists=soup.find('article').findAll("ul")
        cap_gain=cap_gains_to_dict(ulists)
        married_cap_gain=cap_gains_to_dict(ulists, is_married=True)
        return (cap_gain, married_cap_gain)
    else:
        return None

def scrape_deductions()->tuple[str,str]:
    """ Scrapes for standard deduction. Returns individual and married deduction dictionary if found, else None

    Returns:
        tuple[str,str]: (individual deduction, married deduction)
    """
    # Make GET Request
    r=requests.get(FEDERAL_DEDUCTIONS_URL)
    if r.status_code==200:
        soup=BeautifulSoup(r.content, 'html.parser')
        # Extracts Table 10-1
        table=soup.find('div', id="idm140408599383584").findAll('table')[1]
        headers, rows=extract_table(table)
        print(rows[:2])
        deduction=rows[0][1]
        married_deduction='$'+rows[1][1]
        return (deduction, married_deduction)
    return None

def scrape_federal_tax():
    """
    Scrapes for income, standard deductions, and capital gains
    Saves to .yaml file
    """
    cap_gains, married_cap_gains=scrape_cap_gains_tax()
    income, married_income=scrape_income_tax()
    deduction, married_deduction=scrape_deductions()
    to_yaml={
        "individual": {"income": income, "deduction": deduction, "cap_gains": cap_gains},
        "couple": {"income": married_income, "deduction": married_deduction, "cap_gains": married_cap_gains}
    }
    save(to_yaml,'federal_tax.yaml')

def scrape_ny_income_tax():     
    """Scrapes NYS income tax from NYS official website. Saves yaml file to "ny_income_tax.yaml"
    """
    r=requests.get(NY_INCOME_URL)
    if r.status_code==200: 
        soup=BeautifulSoup(r.content, 'html.parser')

        tables=soup.findAll('table', class_="tableborder")[:20]
        _, married_rows=extract_table(tables[18])
        
        _,rows=extract_table(tables[19])
        income_dict=ny_income_to_dict(rows)
        married_income_dict=ny_income_to_dict(married_rows)
        
        to_yaml={
            "individual": {"income": income_dict},
            "couple": {"income": married_income_dict}
        }
        
        save(to_yaml, "ny_income_tax.yaml")

def scrape_nj_ct_income_tax(is_ct:bool=False):
    """Scrapes either NJ or CT income tax from iCalculator, which is a third party website.
    Saves into yaml file {state}_income_tax.yaml

    Args:
        is_ct (bool, optional): If the state is Conneticut. Defaults to False.
    """
    url=NJ_INCOME_URL if not is_ct else CT_INCOME_URL
    state= "nj" if not is_ct else "ct"
    r=requests.get(url)
    if r.status_code==200: 
        soup=BeautifulSoup(r.content, 'html.parser')
        tables=soup.findAll('table')[:2]
        _,rows=extract_table(tables[0])
        print(rows)
        _, married_rows=extract_table(tables[1])
        income_dict=icalculator_income_to_dict(rows)
        married_income_dict=icalculator_income_to_dict(married_rows)
        
        to_yaml={
            "individual": {"income": income_dict},
            "couple": {"income": married_income_dict}
        }
        
        save(to_yaml, f"{state}_income_tax.yaml")
                
    pass


if __name__=="__main__":                
    scrape_federal_tax()
    scrape_ny_income_tax()
    scrape_nj_ct_income_tax()
    scrape_nj_ct_income_tax(is_ct=True)
    
