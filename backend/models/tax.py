from typing import Dict
import os
import yaml

from muskets.tax_scraper import scrape_federal_tax, scrape_nj_ct_income_tax

class FederalTax: 
    def __init__(self, file_status:str):
        """
        file_status: str
            The filing status 'couple' or 'individual'
        """
        self.status = file_status
        self.bracket=self.get_bracket()
        self.deduction = self.bracket[self.status]['deduction']

    def get_bracket(self) -> Dict:
        return {}

class StateTax:
    def __init__(self, file_status:str):
        self.status = file_status
        self.bracket=self.get_bracket()

    def get_bracket(self):
        return {}
