# For Developers :computer:
Welcome to the backend :flushed:

Before we talk about anything, make sure that you have set up your backend following the instructions in the `README.md` in the root directory.

## Setup Introduction :suspension_railway:
I set up the development environment using `python3-venv` so that our development environment is virtualized and not affected by the other existing packages on our local machines.

Use `venv` adds a bit of complexity, but it helps us to be on the same page! And plus I'm here to help you to get used to it :wink:

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
