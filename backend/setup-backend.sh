# Remove existing virtual environment.
rm -rf musk-venv

# Install Python 3, pip, and venv if not already installed.
sudo apt update
sudo apt install python3
sudo apt install python3-pip
sudo apt install python3-venv

source ~/.bashrc

# Create a new virtual environment and install dependencies.
python3 -m venv musk-venv
source musk-venv/bin/activate
pip install -r requirements.txt
