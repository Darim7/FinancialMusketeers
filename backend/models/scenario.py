from typing import List
from investment import Investment
from event_series import EventSeries, Expense
from roth_optimizer import RothConvertOptimizer
from rmd import RMD
from user import User
from results import SimulationResults
class Scenario:
    def __init__(self, name:str, financial_goal:int, state:str, birth_yr: int, life_exp:int, ivmts: List[Investment], event_series: List[EventSeries], spending_strat: List[Expense], expense_withdrawal_strat: List[Investment], inflation_rate:float, roth_optimizer:RothConvertOptimizer, rmd_strat: RMD, pretax_ann_contribution:int, aftertax_ann_contribution: int, is_married: bool, spouse_name:str="", spouse_birth_yr:int=0, spouse_life_exp:int=0, shared:List[User]=[]):
        self.name=name
        self.financial_goal=financial_goal
        self.state=state
        self.birth_yr=birth_yr
        self.life_exp=int
        self.ivmts=ivmts
        self.event_series=event_series
        self.spending_strat=spending_strat
        self.expense_withdrawal_strat=expense_withdrawal_strat
        self.inflation_rate=inflation_rate
        self.roth_optimizer=roth_optimizer
        self.rmd_strat=rmd_strat
        self.pretax_ann_contribution=pretax_ann_contribution
        self.aftertax_ann_contribution=aftertax_ann_contribution
        self.is_married=is_married
        self.spouse_name=spouse_name
        self.spouse_birth_yr=spouse_birth_yr
        self.spouse_life_exp=spouse_life_exp
        self.shared=shared
        self.sim_results=[]
        
    def run(runs:int):
        pass
    
    def simulate(self):
        pass