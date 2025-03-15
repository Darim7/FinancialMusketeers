from typing import Self, List
class AssetType:
    def __init__(self, name:str, description:str, exp_ann_return: float, expense_ratio: float, exp_ann_recur_rev: float, is_taxable: bool):
        self.name=name
        self.description=description
        self.exp_ann_return=exp_ann_return
        self.expense_ratio=expense_ratio
        self.exp_ann_recur_rev=exp_ann_recur_rev
        self.is_taxable=is_taxable
        
    def get_name(self)->str:
        return self.name
    def get_description(self)-> str:
        return self.description
    def get_exp_ann_return(self)-> float:
        return self.exp_ann_return
    def get_expense_ratio(self)-> float:
        return self.expense_ratio
    def get_exp_ann_recur_rev(self)-> float:
        return self.exp_ann_recur_rev
    def get_taxable(self)-> bool:
        return self.is_taxable
    
    # NOTE: Don't know if this is needed, but I added this here.
    def set_name(self, name:str):
        self.name=name
    def set_description(self, description:str):
        self.description=description
    def set_exp_ann_return(self, exp_ann_return:float):
        self.exp_ann_return=exp_ann_return
    def set_expense_ratio(self, expense_ratio:float):
        self.expense_ratio=expense_ratio
    def set_exp_ann_recur_rev(self, exp_ann_recur_rev:float):
        self.exp_ann_recur_rev=exp_ann_recur_rev
    def set_taxable(self, is_taxable:bool):
        self.is_taxable=is_taxable
        
class Investment: 
    def __init__(self, value: str, asset_type: AssetType, tax_status: str):
        self.value=value
        self.asset_type=asset_type
        self.tax_status=tax_status
        
    ### TODO: Below are to be implemented
    # Utilities for investments
    def update(self): 
        pass
    def transfer_in_kind(self)-> Self:
        pass
    def invest(self, value:float)-> None:
        pass
    def sell(self, value:float)-> float:
        pass
    def calculate_total_value(investments:List[Self]):
        pass