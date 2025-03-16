import yaml

with open('scenario.yaml', 'r') as file:
    f = yaml.safe_load(file)

for k in f:
    print(k)
