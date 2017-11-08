// Packages
const express    = require('express');
const path       = require('path');
const mysql      = require('mysql');
const bodyParser = require('body-parser');
const cors       = require('cors');
const session    = require('express-session');

// MySQL Connection
global.db = require('./db');

// Create express server
const app = express();

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

// Session - Middelware
app.use(session({
    resave: true,
    secret: 'V#5PQ7WLkk%*7ckr',
    saveUninitialized:true,
    cookie: { maxAge: (60000*30) }
}));

// Routes
app.use('/admin', require('./routes/rt_admin'));

// Listen to port
const port = process.argv[2] || process.env.port || 3500;
app.listen( port, () => {
    console.log(`Server is listening on ${port}.`);
});
