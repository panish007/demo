const express = require("express");
const app = express();
const connectionDB = require("./db/connect");
require("dotenv").config({
    path: "config/.env"
})
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const session = require('express-session');
const bodyParser = require("body-parser");
const flash = require('connect-flash');
const methodOverride = require('method-override');
var useragent = require('express-useragent');


app.use(useragent.express());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 } 
    })
  );

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        }
    })
);

// Flash Messages
app.use(flash({ sessionKeyName: 'flashMessage' }));
app.use(methodOverride('_method'));


app.set('view engine', 'ejs');

app.get('/demo', (req, res) => {
    res.render('login');
})
const user = require("./routes/userRoutes");
const Contact = require("./routes/contactRoutes");
const group = require("./routes/groupRoutes");


app.use('/', user);
app.use('/', Contact);
app.use('/', group);
app.use('*', (req, res) => {
    res.status(404).render('404');
})

//middleware.
app.use(errorHandler);

const start = async () => {
    try {
        await connectionDB(process.env.MONGO_URL);
        app.listen(5000, console.log("server is running...."));
    } catch (error) {
        console.log(error);
    }
}

start();