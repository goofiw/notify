'use strict'
var members = require('../controllers/members.js');
var auth = require('../controllers/auth.js');
var router = require('koa-router')();

  router.get('/api/members', auth.isAuth, members.allmembers);

  router.post('/api/addmembers', auth.isAuth, members.addMembers);

  router.post('/api/addmember', auth.isAuth, members.addNewMember);

  router.post('/api/notify', members.notify);

  router.post('/api/login', auth.login);

  router.post('/api/signup', auth.signup);

  router.get('/api/authcheck', auth.checkToken);


  router.post('/api/fileupload', function *(next) {
    console.log(this);
    yield this.body = {};
  }),


  router.get('/api/awsurl', function *(next){
    yield this.body = {url: upload.getUrl()};
  }),

  router.get('/', function *(next) {
    yield this.render('index'); 
  }),

module.exports = router.routes();