from typing import Dict
class Tax:
    def __init__(self, file_status:str):
        pass
class FederalTax(Tax): 
    def __init__(self, file_status:str):
        super().__init__(file_status)
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

class StateTax(Tax):
    def __init__(self, file_status:str):
        super().__init__(file_status)
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
    