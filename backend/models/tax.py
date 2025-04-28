from typing import Dict
import os
import yaml

from muskets.tax_scraper import read_tax_to_dict

class FederalTax: 
    def __init__(self):
        """
        file_status: str
            The filing status 'couple' or 'individual'
        """
        # self.status = file_status
        self.bracket=read_tax_to_dict('federal')
        # self.bracket=self.bracket
    
class StateTax:
    def __init__(self, state:str):
        # self.status = file_status
        self.bracket=read_tax_to_dict(state)

