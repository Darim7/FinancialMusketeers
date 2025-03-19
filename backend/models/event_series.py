from typing import List
from models.investment import Investment, AssetType
class EventSeries: 
    def __init__(self, name:str, description:str, start_yr:int, duration:int):
        self.name=name
        self.description=description
        self.start_yr=start_yr
        self.duration=duration

class Income(EventSeries):
    def __init__(self, name:str, description:str, start_yr:int, duration:int, is_wages:bool, init_amt: float, exp_ann_change_in_amt: float, is_inflation_adj: bool, spouse_percentage:float):
        super().__init__(name, description, start_yr, duration)
        self.is_wages=is_wages
        self.init_amt=init_amt
        self.exp_ann_change_in_amt=exp_ann_change_in_amt
        self.is_inflation_adj=is_inflation_adj
        self.spouse_percentage=spouse_percentage

class Expense(EventSeries):
    def __init__(self, name:str, description:str, start_yr:int, duration:int, is_discretionary:bool, init_amt:float, exp_ann_change_in_amt: float, is_inflation_adj: bool, spouse_percentage:float):
        super().__init__(name, description, start_yr, duration)
        self.is_discretionary=is_discretionary
        self.init_amt=init_amt
        self.exp_ann_change_in_amt=exp_ann_change_in_amt
        self.is_inflation_adj=is_inflation_adj
        self.spouse_percentage=spouse_percentage

class Invest(EventSeries):
    def __init__(self, name:str, description:str, start_yr:int, duration:int, asset_allocation:List[float], selected_invest: List[Investment], max_cash: float):
        super().__init__(name, description, start_yr, duration)
        self.asset_allocation=asset_allocation
        self.selected_invest=selected_invest
        self.max_cash=max_cash
    def calculate_excess(self,cash:float)->float:
        pass
        

class Rebalance(EventSeries):
    def __init__(self, name:str, description:str, start_yr:int, duration:int, asset_allocation:List[float], investments:List[Investment]):
        super().__init__(name, description, start_yr, duration)
        self.asset_allocation=asset_allocation
        self.investments=investments
    def rebalance(self)->List[Investment]:
        pass