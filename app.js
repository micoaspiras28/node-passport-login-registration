const express = require('express');
const expressLayouts = require('express-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport);

//MongooDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node-passport-login', {useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected..')
);

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// BodyParsar
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// express session
app.use(session({
    secret: 'Thisismytestkey',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error_msg = req.flash('error');

    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port 5000'));