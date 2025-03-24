from typing import List, Self
from models.investment import Investment
class RothConvertOptimizer:
    def __init__(self, start:int, end: int, ord_tax_deferred_ivmts:List[str]):
        self.start=start
        self.end=end
        self.ord_tax_deferred_ivmts=ord_tax_deferred_ivmts
    def convert(year:int, income:float, investments:List[Investment])->float:
        pass
    
    def get_ord_tax_deferred_ivmts(self):
        return self.ord_tax_deferred_ivmts
    def get_start(self):
        return self.start
    def get_end(self):
        return self.end
    def __eq__(self, rco:Self):
        ord_tax_deferred_ivmts=self.get_ord_tax_deferred_ivmts()
        ### TODO: TO BE IMPLEMENTED
        pass