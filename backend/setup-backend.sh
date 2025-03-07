sudo apt update
sudo apt install python3
sudo apt install python3-pip
sudo apt install python3-venv

source ~/.bashrc

python3 -m venv musk-venv

source musk-venv/bin/activate
pip install -r requirements.txt