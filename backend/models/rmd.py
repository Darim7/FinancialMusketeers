from models.investment import Investment
from typing import List, Dict
from muskets.tax_scraper import read_rmd_to_dict
import logging

logger = logging.getLogger(__name__)
class RMD:
    def __init__(self, ord_tax_deferred_ivmts:List[Investment]):
        self.ord_tax_deferred_ivmts=ord_tax_deferred_ivmts
        self.table=read_rmd_to_dict()
    
    def calculate_rmd(self, age: int)-> float:
        if age < 73: 
            return 0
        if age >= 120: 
            return self.table[120]
        return self.table[age]
        
    def trigger(withdraw:float, investments:List[Investment])-> bool:
        pass