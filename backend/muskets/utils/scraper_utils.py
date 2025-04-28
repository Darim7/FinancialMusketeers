from typing import List, Dict
import yaml
def convert_to_num(data: dict) -> dict:
    """
    Recursively convert:
    - String keys representing integers to actual integers.
    - Percentages represented as strings (e.g., '1.4%') to decimal numbers (e.g., 0.014).
    """
    if isinstance(data, dict):
        return {int(k) if k.isdigit() else k: convert_to_num(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_to_num(i) for i in data]
    elif isinstance(data, str) and data.endswith('%'):
        # Convert percentage to decimal
        return float(data[:-1]) / 100
    elif isinstance(data, str) and data.startswith('$'):
        # Convert dollars to decimal
        return float(data[1:].replace(',', ''))
    else:
        return data

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

def save(to_yaml:Dict, to_dest:str):
    """
    Saves the scraped tax information to a Yaml file.
    """
    with open(to_dest, 'w') as file:
            yaml.dump(to_yaml, file, default_flow_style=False, sort_keys=False)
