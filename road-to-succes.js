// Packages
const express    = require('express');
const path       = require('path');
const mysql      = require('mysql');
const bodyParser = require('body-parser');
const cors       = require('cors');
const session    = require('express-session');
const mongoose   = require('mongoose');
const cookieParser = require('cookie-parser');

// MySQL Connection
global.db = require('./db');

// MongoDB Connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/roadToSuccess", {useMongoClient: true})
        .then( () => { // check db connection
            console.log('MongoDB has been conneted');
        })
        .catch( err => { //Check for db errors
            console.log(`There is an error: ${err}`);
        });

// Create express server
const app = express();

// Shahrokh Library
const core = require('./core');

// App Config
app.configs = core.configs;

// Load Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Define a static folder path
app.use(express.static(path.join(__dirname, 'public')));

// Parse posted data - Middelware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cross-origin resource sharing - Middelware
app.use(cors());

// Cookie - Middelware
app.use(cookieParser())

// Session - Middelware
app.use(session({
    resave: true,
    secret: 'V#5PQ7WLkk%*7ckr',
    saveUninitialized:true,
    cookie: { maxAge: (60000*30) }
}));

// My Core Functions
app.use('*', core.pathUserSession);

// Routes
app.use('/admin', require('./routes/rt_admin'));
app.use('/api',   require('./routes/rt_api'));
app.use('/filemanager', require('./richfilemanager/filemanager')(path.normalize(`${__dirname}/public/userfiles`)));
app.use('/', require('./routes/rt_frontend'));


// Listen to port
const port = process.argv[2] || process.env.port || 3501;
app.listen( port, () => {
    console.log(`Server is listening on ${port}.`);
});
