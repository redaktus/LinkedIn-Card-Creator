var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');

// Config
var passportConfig = require('./config/passportConfig.js');

// Controllers
var authentController = require('./controllers/authentication.js');
var indexController = require('./controllers/index.js');
var profileController = require('./controllers/profile.js');
var publicController = require('./controllers/publicController.js');


// Connect to database
mongoose.connect('mongodb://localhost/ombud');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(flash());
app.use(session({secret: '5+_)ohl4t+etiejhtlkajdfhu'}));
app.use(passport.initialize());
app.use(passport.session());




// DIRECT THE USER TO THE LOGIN PAGE
app.get('/', indexController.index);

app.get('/auth/login', indexController.login);

app.get('/auth/sign-in', authentController.signIn);



/*+++++++++++++++++++++++++++ LinkedIn Login +++++++++++++++++++++++++++*/
app.get('/auth/linkedin', authentController.URLsignIN);

// 	passport.authenticate(
// 		'linkedin',
// 		{scope: ['r_fullprofile', 'r_basicprofile']}
// 	),
// 	function(req, res) {
// 	// This funciton is not called
// 	}
// );

app.get('/auth/linkedincallback', authentController.requestToken);

// 	passport.authenticate('linkedin', {failureRedirect: '/auth/login'}),
// 	authentController.passLogin
// );

/*------------------------- End LinkedIn Login -------------------------*/


app.get('/profile/editable/:userID/:customAccess', profileController.createCard);
app.get('/public/:profile/share', publicController.publicProfile);
app.get('/auth/getProfile', profileController.getProfile);
app.post('/profile/updateProfile', profileController.updateProfile);
app.get('/public/generatePublic', publicController.generatePublic);

// Prevent un-signed-in navigation
app.use(passportConfig.ensureAuthent);




// app.get('/profile/getInfo', profileController.getInfo);


var server = app.listen(9092, function() {
	console.log('Express server listening on port ' + server.address().port);
});
