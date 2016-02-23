'use strict'
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost/testNotify');
var co = require('co');

var mailer = require('../modules/mailer.js');
var slack = require('../modules/slack.js');


var members = wrap(db.get('members'));

co(function * () {
  var members = yield members.find({});
});

//validation
// members.index('email', {unique:true});

module.exports.allmembers = function *allmembers(next) {
  if ('GET' != this.method) return yield next;
  this.body = yield members.find({})
}
module.exports.addMembers = function *addMembers(next) {
  if ('POST' != this.method) return yield next;
  var newMembers = JSON.parse(this.body).data;
  members.remove({});
  for(let i = 0; i < newMembers.length; i++){
    var checkDuplicate = yield members.find({email: newMembers[i].Email});
    console.log(checkDuplicate, "checking for Duplicate", newMembers[i].Email)
    if (checkDuplicate.length === 0) {
      add(members, newMembers[i]);
    }
    // if (!inserted) {
    //   console.log(members[i], ' could not be added')
    // }
    // console.log(inserted, 'has been added');
  }
  this.body = yield members.find({});
}

module.exports.addNewMember = function *addNewMember(next) {
  if ('POST' != this.method) return yield next;
  var newMember = JSON.parse(this.body).data;
  this.body = add(members, newMember)
}

module.exports.notify = function *notify(next) {
  if ('POST' != this.method) return yield next;
  var data = JSON.parse(this.body);
  console.log('\n\n\ndata',data);
  var notifyMember = yield members.findOne({_id: data.id})
  var message = 'This is an automated message from the StartUp Hall Front desk. \n' + data.visitorName + ' has arrived and is waiting in the lobby \n\n\n\n Thank you, \n\n StartUp Hall Robots'; // plaintext body 

  var mailOptions = {
      from: notifyMember.name + ' <goofiwmailer@gmail.com>', // sender address 
      to: notifyMember.name + ', ' + notifyMember.email + ', Associate <associate@startuphall.org>',// list of receivers 
      subject: data.visitorName + ' is waiting in the lobby', // Subject line 
      text: message
  };
  mailer(mailOptions);
  if (notifyMember.slack) {
    console.log("sending slack");
    slack(message, notifyMember.slack);
  }
  this.body =  yield {member: notifyMember.name};
}

//helper functions

function add(members, member) {
  var newMember = {
    name: member.First + ' ' + member.Last,
    email: member.Email,
    company: member['Company/Org'],
    slack: member.Slack.slice(1)
  }
  if (member.first != undefined) {
    newMember = {
      name: member.first + ' ' + member.last,
      email: member.email,
      company: member.company,
      slack: member.slack.slice(1)
    }
  }
  console.log('logging member in addMember', member);
  console.log('adding', newMember);

  members.insert(newMember, function(err, member){
    if (err) {
      throw err;
    }
    member;
  });
  return newMember;
}
