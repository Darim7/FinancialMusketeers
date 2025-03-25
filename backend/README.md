# For Developers :computer:
Welcome to the backend :flushed:

Before we talk about anything, make sure that you have set up your backend following the instructions in the `README.md` in the root directory.

## Setup Introduction :suspension_railway:
I set up the development environment using `python3-venv` so that our development environment is virtualized and not affected by the other existing packages on our local machines.

Use `venv` adds a bit of complexity, but it helps us to be on the same page! And plus I'm here to help you to get used to it :wink:

**Some of the docker commands CAN NOT be done in the python-venv (e.g. You won't be able to do `docker compose down` when you are in the virtual environment). :sob:**

So if you see something like this:
```
permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.48/containers/json?all=1&filters=%7B%22label%22%3A%7B%22com.docker.compose.config-hash%22%3Atrue%2C%22com.docker.compose.oneoff%3DFalse%22%3Atrue%2C%22com.docker.compose.project%3Dfinancialmusketeers%22%3Atrue%7D%7D": dial unix /var/run/docker.sock: connect: permission denied
```
It is probaly because your terminal is sourcing from the python venv.

You will see something like this when you are in a virtual environment:
```
(musk-venv) zenos@DESKTOP-7H9VUBL:~/cse416/FinancialMusketeers$ docker compose down
```

## How do I add a package? :no_mouth:
To add a package, you will need to first put the package name in  `requirments.txt`.

Then, you will need to setup your backend again. `setup-backend.sh` will delete the existing virtual environment and install all the package included in `requirements.txt`.
```
./setup-backend.sh
```

Finally, you will need to rebuild the container.
```
cd .. # Navigate to root directory
docker compose down
docker compose up -d
```

## What if VSCode is too dumb to find the Python Interpreter in `musk-venv`? :sob:
1. Click on `Select Interpreter`
2. Click on `Enter interpreter path...`
3. Enter the path `<whatever path to>/FinancialMusketeers/backend/musk-venv`
