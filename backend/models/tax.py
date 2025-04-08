from typing import Dict
import os
import yaml

from muskets.tax_scraper import scrape_federal_tax, scrape_nj_ct_income_tax

class FederalTax: 
    def __init__(self, file_status:str):
        self.status = file_status
        self.bracket=self.get_bracket()

    def get_bracket(self):
        pass
    
    def calculate_rate(self, income:int):
        pass
    
    def calculate_income_tax(self, deduct_income:int)->int:
        pass
    
    def calculate_cap_gain_tax(self, deduct_income:int)->int:
        pass
    
    def calculate_deduction(self, income:int)->int:
        pass
    
    def calculate_withdrawal_tax(self, withdrawal:int)->int:
        pass

class StateTax:
    def __init__(self, file_status:str):
        self.status = file_status
        self.bracket=self.get_bracket()

    def get_bracket(self):
        pass
    
    def calculate_rate(self, income:int):
        pass
    
    def calculate_income_tax(self, deduct_income:int)->int:
        pass
    
    def calculate_cap_gain_tax(self, deduct_income:int)->int:
        pass
    
    def calculate_deduction(self, income:int)->int:
        pass
    
    def calculate_withdrawal_tax(self, withdrawal:int)->int:
        pass
    