# For Developers
This is the frontend part of the FinancialMusketeers!

### Before we start, make sure that you have run the set up script as instructed in the readme in the project :angry:

Great! I'm gonna tell you how this thing is meant to be working.

To get the linter to work on vscode, you need the libraries (i.e. `node_modules`) to be in the direcotory. That is why I wrote `npm install` in `setup-frontend.sh`.

## Want to add a package? :anguished:
When you want to add a package to the frontend, you can first install the package locally.
```
npm install <package-name>
```
Installing the package locally only helps vscode to help lint your code (i.e. give hints about the package that you added when you code) and `package.json` is updated with the package you added.

But we still need to make sure the updated package is installed on our docker container :whale2:

So we need to rebuild it :frowning:
```
cd .. # Navigate to the root directory
docker compose down
docker compose up --build -d
```
This way the container will install packages according to `package.json` and therefore the updates will be reflected!

**TLDR: The frontend is running on a docker container, so any npm commands that is run locally WON'T reflect on the container!!!**

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
