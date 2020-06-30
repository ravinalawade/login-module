require('./config/config');
require('./models/db');
// require('./config/passportConfig');

const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const cors = require('cors');
const port=process.env.PORT
// const passport = require('passport');

const rtsIndex = require('./routes/indexrouter');

var app = express();
app.set('view engine', 'ejs');

//frontend urls
app.get('/', (req, res)=>{ 
    res.render('login'); 
    }); 

// middleware
app.use(bodyParser.json());
app.use(cors());
// app.use(passport.initialize());
app.use(session({secret:'ravi',
                resave: true, 
                saveUninitialized: true}));
app.use('/api', rtsIndex);

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

// start server
app.listen(port, () => console.log(`Server started at port : ${port}`));