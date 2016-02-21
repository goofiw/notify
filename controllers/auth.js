'use strict'
var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost/testNotify');
var co = require('co');
var bcrypt = require('co-bcrypt');
var jwt = require('jsonwebtoken');


var users = wrap(db.get('users'));

co(function * () {
  var users = yield users.find({});
});

function *signup(next) {
  var userData = this.request.body;
  console.log(this.request.body);
  var user = yield users.find({username: userData.username})
  console.log('user',user)
  if(user.length === 1) {
    if(bcrypt.compare(userData.password, user.hash)) {
      console.log('tried creating user but already user', user)
      this.body = {message: 'Bro, you already signed up with that username and password'}
    } else {
      this.body = {message: 'username exists!'};
    }
  } else {
    //create user
    var salt = yield bcrypt.genSalt(10)
    var hash = yield bcrypt.hash(userData.password, salt)
    var token = jwt.sign({ foo: user.name }, process.env.JWTSECRET);
    users.updateById(user.id, this.user, function(err, user) {
      if (err) {
        this.body = {message: 'error updating jwt'};
      }
    })   
    yield users.insert({ 
      username: userData.username, 
      hash: hash, 
      jwt: token, 
      preferance: userData.preferance,
      phone: userData.phone,
      name: userData.name
    });
    console.log('user after insert');
    this.body = yield users.findOne({username: userData.username});
  }
}

function *checkToken(next) {
  console.log('this', this)
  var providedToken = this.header.authorization;
  var user = yield users.findOne({jwt: providedToken})
  if (user) {
    this.state.user = user;
    this.status = 200;
  } else {
    this.status = 403;
    this.body = {message: 'failed token auth'};
  }
}

function *isAuth(next) {
  console.log('this', this)
  var providedToken = this.header.authorization;
  var user = yield users.findOne({jwt: providedToken})
  if (user) {
    this.state.user = user;
    yield next;
  } else {
    this.status = 403;
    this.body = {message: 'failed token auth'};
  }
}

function *login(next) {
  var userData = this.request.body;
  console.log('user data in login', userData);
  console.log('the login request', this.request)
  // console.log('logging body in login', this);
  var user = yield users.findOne({username: userData.username})
  if(user && bcrypt.compare(userData.password, user.hash)) {
    user.jwt = jwt.sign({ foo: user.username }, process.env.JWTSECRET);
    yield users.updateById(user._id, user)
    this.user = user;
    this.body = user;
  } else {
    this.body = {message: 'invalid username or password'};
    this.status = 403;
  }
}

function *logout(next) {
  this.user.jwt = null; 
  users.updateById(user.id, this.user, function(err, doc){
    if (err) {
      this.body = {message: 'error logging out'}
    } else {
      this.body = {message: 'logout successfull'}
    }
  })
}

module.exports = {
  login: login,
  signup: signup,
  logout: logout,
  checkToken: checkToken,
  isAuth: isAuth
}

