require('./config/config');
require('./models/db');
// require('./config/passportConfig');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session')
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('connect-flash');
const port=process.env.PORT
// const passport = require('passport');

const rtsIndex = require('./routes/indexrouter');
const User = mongoose.model('User');
const Visit = mongoose.model('Visit');

var app = express();
app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.json());
app.use(cors());
// app.use(passport.initialize());
app.use(session({secret:'ravi',
                resave: true, 
                saveUninitialized: true}));
app.use('/api', rtsIndex);
app.use(flash());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

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

//frontend urls
app.get('/', (req, res)=>{ 
    res.render('login'); 
});

app.get('/dashboard_u', (req, res)=> {
	User.find({}, function(err, users) {
		if (err) {
			console.log('Something went wrong');
		} else {
			res.render('dashboard_u', {users: users});
		}
	});
});

app.get('/dashboard_v/:id', (req, res)=> {
	Visit.find({'booth_id': req.params.id}, function(err, visits) {
		if (err) {
			console.log('Something went wrong');
		} else {
			res.render('dashboard_v', {visits: visits, id: req.params.id});
		}
	});
});

// app.get('/otpverify', (req, res)=> {
// 	res.render('otpverify');
// });

// start server
app.listen(port, () => console.log(`Server started at port : ${port}`));