# FinancialMusketeers
Welcome to FinancialMusketeers! This is an app develop by **the Musketeers** :sunglasses:

This app is aimed to provide a basic financial planner that helps you to plan your life! Include spendings, income taxes, investments...

# For Users
### To run our app, please follow the steps below

Clone the repository.
```
git clone <link to this repo>
```

Navigate to the project directory.
```
git clone <this repo link>
```

Compose the docker services.
```
docker compose up -d
```

### If you don't have docker installed you should install docker first :whale:
```
./setup-docker.sh
```

**After the services are up, you can access the app's frontend at `localhost:8080`. Have fun :smile:**

# For Developers
### REMEMBER TO READ THE READMEs IN BOTH FRONTEND AND BACKEND :rage::rage::rage:

**Set up the development environment for...**

Frontend
```
cd frontend
./setup-frontend.sh
```

Backend
```
cd backend
./setup-backend.sh
```

## Note :innocent:
The development environment is installed ON your **host machine**.

However, the docker container will only copy the `requirement.txt` (for backend) or `package.json` (for frontend) and set up their environment during the `build` process.

So, if you changed your environment while you are developing, for it to be reflected on the container, you need to rebuild your container.

To rebuild your container
```
docker compose down
docker compose up --build -d
```
