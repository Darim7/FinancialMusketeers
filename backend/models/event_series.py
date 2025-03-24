from typing import List, Self, Dict
from models.exportable import Exportable
from models.investment import Investment, AssetType

class EventSeries(Exportable): 
    def __init__(
            self,
            name: str,
            start: Dict,
            duration: Dict,
            type: str,
            data: Dict
        ):
        self.name = name
        self.start = start
        self.duration = duration
        self.type = type
        self.data = data
    
    # Getter methods
    def get_name(self) -> str:
        return self.name

    def get_start(self) -> Dict:
        return self.start

    def get_duration(self) -> Dict:
        return self.duration

    def get_type(self) -> str:
        return self.type

    def get_data(self) -> Dict:
        return self.data
    
    # Setter methods
    def set_name(self, name: str) -> None:
        self.name = name

    def set_start(self, start: Dict) -> None:
        self.start = start

    def set_duration(self, duration: Dict) -> None:
        self.duration = duration

    def set_type(self, type: str) -> None:
        self.type = type

    def set_data(self, data: Dict) -> None:
        self.data = data
    def to_dict(self) -> Dict:
        return self.data

    @classmethod
    def from_dict(cls, data: Dict) -> Self:
        return cls(
            name=data['name'],
            start=data['start'],
            duration=data['duration'],
            type=data['type'],
            data=data
        )

class Income(EventSeries):
    def __init__(self, eventSerie: EventSeries):
        super().__init__(eventSerie.name, eventSerie.start, eventSerie.duration, eventSerie.type, eventSerie.data)
        data = eventSerie.data
        self.initalAmount = data['initialAmount']
        self.changeAmtOrPct = data['changeAmtOrPct']
        self.changeDistribution = data['changeDistribution']
        self.inflationAdjusted = data['inflationAdjusted']
        self.userFraction = data['userFraction']
        self.socialSecurity = data['socialSecurity']
    # Getter methods
    def get_initial_amount(self) -> float:
        return self.initialAmount

    def get_change_amt_or_pct(self) -> str:
        return self.changeAmtOrPct

    def get_change_distribution(self) -> Dict:
        return self.changeDistribution

    def is_inflation_adjusted(self) -> bool:
        return self.inflationAdjusted

    def get_user_fraction(self) -> float:
        return self.userFraction

    def is_social_security(self) -> bool:
        return self.socialSecurity
    
    # Setter methods
    def set_initial_amount(self, amount: float) -> None:
        self.initialAmount = amount

    def set_change_amt_or_pct(self, change: str) -> None:
        self.changeAmtOrPct = change

    def set_change_distribution(self, distribution: Dict) -> None:
        self.changeDistribution = distribution

    def set_inflation_adjusted(self, inflation_adjusted: bool) -> None:
        self.inflationAdjusted = inflation_adjusted

    def set_user_fraction(self, fraction: float) -> None:
        self.userFraction = fraction

    def set_social_security(self, social_security: bool) -> None:
        self.socialSecurity = social_security
class Expense(EventSeries):
    def __init__(self, eventSerie: EventSeries):
        super().__init__(eventSerie.name, eventSerie.start, eventSerie.duration, eventSerie.type, eventSerie.data)
        data = eventSerie.data
        self.is_discretionary = data['discretionary']

        self.initalAmount = data['initialAmount']
        self.changeAmtOrPct = data['changeAmtOrPct']
        self.changeDistribution = data['changeDistribution']
        self.inflationAdjusted = data['inflationAdjusted']
        self.userFraction = data['userFraction']
    # Getter methods
    def is_discretionary_expense(self) -> bool:
        return self.is_discretionary

    def get_initial_amount(self) -> float:
        return self.initialAmount

    def get_change_amt_or_pct(self) -> str:
        return self.changeAmtOrPct

    def get_change_distribution(self) -> Dict:
        return self.changeDistribution

    def is_inflation_adjusted(self) -> bool:
        return self.inflationAdjusted

    def get_user_fraction(self) -> float:
        return self.userFraction
    
    # Setter methods
    def set_discretionary(self, is_discretionary: bool) -> None:
        self.is_discretionary = is_discretionary

    def set_initial_amount(self, amount: float) -> None:
        self.initialAmount = amount

    def set_change_amt_or_pct(self, change: str) -> None:
        self.changeAmtOrPct = change

    def set_change_distribution(self, distribution: Dict) -> None:
        self.changeDistribution = distribution

    def set_inflation_adjusted(self, inflation_adjusted: bool) -> None:
        self.inflationAdjusted = inflation_adjusted

    def set_user_fraction(self, fraction: float) -> None:
        self.userFraction = fraction
class Invest(EventSeries):
    def __init__(self, eventSerie: EventSeries):
        super().__init__(eventSerie.name, eventSerie.start, eventSerie.duration, eventSerie.type, eventSerie.data)
        data = eventSerie.data

        self.assetAllocation = data['assetAllocation']
        self.glidePath = data['glidePath']
        self.assetAllocation2 = data['assetAllocation2'] if self.glidePath else None
        self.maxCash = data['maxCash']

    # Getter methods
    def get_asset_allocation(self) -> Dict:
        return self.assetAllocation

    def has_glide_path(self) -> bool:
        return self.glidePath

    def get_asset_allocation2(self) -> Dict:
        return self.assetAllocation2

    def get_max_cash(self) -> float:
        return self.maxCash
    
    # Setter methods
    def set_asset_allocation(self, asset_allocation: Dict) -> None:
        self.assetAllocation = asset_allocation

    def set_glide_path(self, glide_path: bool) -> None:
        self.glidePath = glide_path
        if not glide_path:
            self.assetAllocation2 = None  # Reset assetAllocation2 if glidePath is disabled

    def set_asset_allocation2(self, asset_allocation2: Dict) -> None:
        if self.glidePath:
            self.assetAllocation2 = asset_allocation2

    def set_max_cash(self, max_cash: float) -> None:
        self.maxCash = max_cash
    
    def calculate_excess(self,cash:float)->float:
        return -1
        

class Rebalance(EventSeries):
    def __init__(self, eventSerie: EventSeries):
        super().__init__(eventSerie.name, eventSerie.start, eventSerie.duration, eventSerie.type, eventSerie.data)
        data = eventSerie.data

        self.assetAllocation = data['assetAllocation']
    # Getter method
    def get_asset_allocation(self) -> Dict:
        return self.assetAllocation
    
    # Setter method
    def set_asset_allocation(self, asset_allocation: Dict) -> None:
        self.assetAllocation = asset_allocation
    def rebalance(self)->List[Investment]:
        pass