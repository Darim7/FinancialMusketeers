from models.investment import Investment
from typing import List, Dict
class RMD:
    def __init__(self, ord_tax_deferred_ivmts:List[Investment]):
        self.ord_tax_deferred_ivmts=ord_tax_deferred_ivmts
        self.table=self.get_table()
    
    def get_table(self):
        pass
    
    def calculate_rmd(age: int)-> float:
        pass
    
    def trigger(withdraw:float, investments:List[Investment])-> bool:
        pass