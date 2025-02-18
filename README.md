# tinder-web-backend

Create an Express server

-> Create a Project folder
-> Do npm init (this will create a package.json file with provided details)
-> Create an src folder, add an app.js file
-> npm i express (web framework for nodejs)
-> create a .env file and keep all the secure informations here(add a port number, db connection string)
    (npm install dotenv)
    (while running the server, it listens for incoming connections on the defined port)
-> npm i -g nodemon
  (Nodemon is a utility that automatically monitors your Node.js application for changes and restarts the server when file changes are detected)
-> initialize git (git init), create a .gitignore file in the root folder(add node_modules in it)
-> create a database in MongoDB Atlas (cloud)
    (add username and password, my ip address for access the cluster, custer0(free)-> Browse collections->create database)
    (Network access- add ip address->Allow Access from anywhere-> will add this ip 0.0.0.0/0 -for allow access from anywhere)
    (Cluster0-> connect-> drivers-> copy connection string and use with mongoose.connect('connection url') by replacing the password, add database name just before question mark)
-> create config folder, and database.js file in it
-> npm i mongoose
    (Mongoose simplifies the interaction between your Node.js application and MongoDB by providing a structured way to define data models, handle validation, and perform CRUD operations)
-> call the db connection function and connect DB before starting server on the port
-> Define schema 
    (Defines the structure and rules for documents in a collection.)
    (A schema is a blueprint for the structure of documents within a MongoDB collection. It defines the shape of the data, including the fields and their data types, validation rules, and default values.They ensure that all documents in a collection follow a defined structure.)
-> Create Model 
    (Models act as an interface to the database, for interacting with documents based on the defined schema, enabling CRUD operations.)
    (eg: models/user.js)
-> Create a User schema & the User Model
-> Create a signup api and push some dummy data into database by post api call using postman tool
(Always try to wrap crud operations within try catch block)
-> Write apis for get all users, get single user by id, update user by id and delete user by id
-> Add schema validation for user (like, minlength, unique, required, enum, validate())
    (By default validate() will only work for new datas(eg: registration), to make it work for updation of docs,
    include the option { runValidators: true } to enable validation during the update.When calling update methods (like findByIdAndUpdate))
-> npm i validator (A library of string validators and sanitizers.)