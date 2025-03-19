class Distribution:
    def __init__(self, type, value:float=0, mean:float=0, stdev:float=0, lower:float=0, upper:float=0, mu:float=0.0, sigma:float=0.0):
        self.type=type
        self.value=value
        self.mean=mean
        self.stdev=stdev
        self.lower=lower
        self.upper=upper
        self.mu=mu
        self.sigma=sigma
        # TODO: Validate if type is fixed, normal, uniform, or GBM
        
    def get_type(self):
        return self.type
    
    def get_value(self):
        return self.value
    
    def set_type(self, type:str):
        self.type=type
        
    def set_value(self, value:float):
        self.value=value
        
    # TODO Add other functions needed and implementations for this class.
    def get_normal_value(self):
        pass