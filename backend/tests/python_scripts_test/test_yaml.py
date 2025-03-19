import yaml

from models.scenario import Scenario

with open('scenario.yaml', 'r') as file:
    f = yaml.safe_load(file)

for k in f:
    print(k)
    print(f[k])

s = Scenario.from_dict(f)
