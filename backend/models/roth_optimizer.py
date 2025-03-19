from typing import List
from models.investment import Investment
class RothConvertOptimizer:
    def __init__(self, start:int, end: int, ord_tax_deferred_ivmts:List[Investment]):
        self.start=start
        self.end=end
        self.ord_tax_deferred_ivmts=ord_tax_deferred_ivmts
    def convert(year:int, income:float, investments:List[Investment])->float:
        pass