var express = require('express');

var session = require('express-session');

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();

var authenticated = false;

app.use(express.static('app'));

app.set('views', __dirname + '/app/views');

app.set('view engine', 'jade');

app.use(cookieParser());

app.use(bodyParser());

app.use(session({ secret: 'vegetable' }));

app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(obj, done){
	done(null, obj);
});

passport.use(new FacebookStrategy({
	clientID: 1609322542640305,
	clientSecret: "e85fa928cdf62125c6dda2c0fd8596f7",
	callbackURL: "http://localhost:3000/auth/facebook/callback",
	profileFields: ['id', 'displayName', 'photos']
}, function(accessToken, refreshToken, profile, done){
	process.nextTick(function () {
	  authenticated = true;
    return done(null, profile);
  });
}));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/dashboard',
	failureRedirect: '/keeptrying'
}));

app.get('/dashboard', function(req, res){
	if(authenticated == true){
		res.render('dashboard', { user: req.user.photos[0].value });
	}else{
		res.redirect('/auth/facebook');
	}
});

app.get('/keeptrying', function(req, res){
	res.render('shrek');
});

var server = app.listen(3000, function(){

	console.log('Test express running at http://localhost:3000');
});
