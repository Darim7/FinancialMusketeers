from typing import Dict, Self, List
from exportable import Exportable

class AssetType(Exportable):
    def __init__(
            self,
            name: str,
            description: str,
            returnAmtOrPct: str,
            returnDistribution: Dict,
            expenseRatio: float,
            incomeAmtOrPct: str,
            incomeDistribution: Dict,
            taxability: bool,
            exp_ann_return: float,
            exp_ann_recur_rev: float
        ):
        self.name = name
        self.description = description
        self.returnAmtOrPct = returnAmtOrPct
        self.returnDistribution = returnDistribution
        self.expenseRatio = expenseRatio
        self.incomeAmtOrPct = incomeAmtOrPct
        self.incomeDistribution = incomeDistribution
        self.taxability = taxability

        # self.exp_ann_return=exp_ann_return
        # self.exp_ann_recur_rev=exp_ann_recur_rev

    def to_dict(self) -> Dict:
        return {
            'name': self.name,
            'description': self.description,
            'returnAmtOrPct': self.returnAmtOrPct,
            'returnDistribution': self.returnDistribution,
            'expenseRatio': self.expenseRatio,
            'incomeAmtOrPct': self.incomeAmtOrPct,
            'incomeDistribution': self.incomeDistribution,
            'taxability': self.taxability
        }
    
    @classmethod
    def from_dict(cls, data) -> Self:
        return cls(**data)
            
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
        
class Investment(Exportable):
    def __init__(
            self,
            investmentType: AssetType,
            value: str,
            taxStatus: str,
            id: str
        ):
        self.asset_type=investmentType
        self.value=value
        self.tax_status=taxStatus
        self.inviestment_id = id

    def to_dict(self) -> Dict:
        return {
            "investmentType": self.asset_type,
            "value": self.value,
            "taxStatus": self.tax_status,
            "id": self.inviestment_id
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Investment':
        return cls(**data)
        
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