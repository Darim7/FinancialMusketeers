from typing import Dict, Self, List
from models.exportable import Exportable

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
            # exp_ann_return: float,
            # exp_ann_recur_rev: float
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

class Investment(Exportable):
    def __init__(
            self,
            investmentType: str,
            value: str,
            taxStatus: str,
            id: str
        ):
        self.asset_type = investmentType
        self.value = value
        self.tax_status = taxStatus
        self.investment_id = id

    def to_dict(self) -> Dict:
        return {
            "investmentType": self.asset_type,
            "value": self.value,
            "taxStatus": self.tax_status,
            "id": self.investment_id
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