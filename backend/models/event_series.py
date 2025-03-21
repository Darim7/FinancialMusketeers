from typing import List, Self, Dict
from models.exportable import Exportable
from models.investment import Investment, AssetType

class EventSeries(Exportable): 
    def __init__(
            self,
            name: str,
            start: int,
            duration: int,
            type: str,
            data: Dict
        ):
        self.name = name
        self.start = start
        self.duration = duration
        self.type = type
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
        data = eventSerie.data
        self.initalAmount = data['initialAmount']
        self.changeAmtOrPct = data['changeAmtOrPct']
        self.changeDistribution = data['changeDistribution']
        self.inflationAdjusted = data['inflationAdjusted']
        self.userFraction = data['userFraction']
        self.socialSecurity = data['socialSecurity']

class Expense(EventSeries):
    def __init__(self, eventSerie: EventSeries):
        data = eventSerie.data
        self.is_discretionary = data['discretionary']

        self.initalAmount = data['initialAmount']
        self.changeAmtOrPct = data['changeAmtOrPct']
        self.changeDistribution = data['changeDistribution']
        self.inflationAdjusted = data['inflationAdjusted']
        self.userFraction = data['userFraction']

class Invest(EventSeries):
    def __init__(self, eventSerie: EventSeries):
        data = eventSerie.data

        self.assetAllocation = data['assetAllocation']
        self.glidePath = data['glidePath']
        self.assetAllocation2 = data['assetAllocation2'] if self.glidePath else None
        self.maxCash = data['maxCash']

    def calculate_excess(self,cash:float)->float:
        return -1
        

class Rebalance(EventSeries):
    def __init__(self, eventSerie: EventSeries):
        data = eventSerie.data

        self.assetAllocation = data['assetAllocation']

    def rebalance(self)->List[Investment]:
        pass