# server
code challenge server

## Instructions
* run npm install
* npm run start
* wait for the db to be connected since Im using MongoDB Atlas it takes time
![alt text](https://github.com/jcd14313/server/blob/master/images/db.PNG) 
## If you want faster db connection 
1. Install mongo db in local
2. Replace DB_URL variable in constants file and replace to your local connection string

```
const DB_URL = mongodb://localhost:27017/assignment

```

2.Create a user using postman

```

api: http://localhost:9000/api/signup
body: 
{
    "email" : "codegame@gmail.com",
    "password": "secretpassword",
    "username": "codegame"
}

```


