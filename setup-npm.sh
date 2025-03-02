# Install curl
sudo apt-get update
sudo apt-get install -y curl

# Install nvm and Node.js LTS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.nvm/nvm.sh  # Load NVM for current session
nvm install --lts

source ~/.bashrc
