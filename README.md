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
-> add app.use(express.json())
    (It automatically converts the JSON data in the request body into a JavaScript object, making it easy to work with in your route handlers.As middleware, it can be added to specific routes or applied globally to handle JSON requests throughout the application.)
-> Create a signup api and push some dummy data into database by post api call using postman tool
(Always try to wrap crud operations within try catch block)
-> Write apis for get all users, get single user by id, update user by id and delete user by id
-> Add schema validation for user (like, minlength, unique, required, enum, validate())
    (By default validate() will only work for new datas(eg: registration), to make it work for updation of docs,
    include the option { runValidators: true } to enable validation during the update.When calling update methods (like findByIdAndUpdate))
-> npm i validator (A library of string validators and sanitizers.)
    (Always try to sanitize data from req.body- it can contain malicious data)
-> create utils/validation.js for handling schema validations 
-> npm i bcrypt (for password encryption using bcrypt.hash())
-> npm i jsonwebtoken ()
-> add a secret key in the .env file for generating a JWT token
-> npm i cookie-parser ( add this as a middleware within app.use(cookieParser()))
    ( used to parse cookies attached to incoming requests.  It automatically parses the Cookie header and populates req.cookies with the cookie key-value pairs, making it easy to access cookie data.)
    (browsers automatically send cookies with every HTTP request to the same domain that set those cookies, Cookies have expiration dates. If a cookie has expired, it will no longer be sent with requests.)
-> create login api 
    (use bcrypt.compare to check the login password and db user password matches) (also create a jwt token and add it to res.cookie())
    (within login success, create a jwt token using jwt.sign() with jwt secret key and user data and attach this token to res.cookie())
-> create middlewares/auth.js to verify token from the cookies and add this middleware to apis
    (use jwt.verify() to check whether the token is valid or not)
    (provide the user result in the response)
-> npm i cors, add it as a middleware( app.use(cors())) (to avoid cross domain api fetching)
    (Also whitelist the domain name within the cors(), If the origin is not whitelisted, the browser will not send cookies)
    (this prevent unauthorized or malicious sites from making requests to your server)
