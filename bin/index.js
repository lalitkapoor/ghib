#!/usr/bin/env node

var url = require('url');
var gift = require('gift');
var colors = require('colors');
var Promise = require('bluebird');
var Ghib = require('../lib/ghib');

var ghauth = Promise.promisify(require('ghauth'));

var usage = 'Usage:'.yellow + ' ghib ' + '<github issue number>'.blue;

if (process.argv.length < 3)
  return console.log(usage);

if (isNaN(parseInt(process.argv[2])) || process.argv[2] === '0') {
  console.error('\n<github issue number> must be a positive integer\n'.red);
  console.error(usage);
  return;
}

// ~/.config/lalitkapoor-ghib.json will store the token
var authOptions = {
  configName: 'lalitkapoor-ghib'
, scopes: ['user', 'public_repo', 'repo']
, userAgent: 'lalitkapoor-ghib'

// necessary: https://github.com/defunkt/gist/issues/166#issuecomment-36096589
, note: 'lalitkapoor-ghib'
};

var git = Promise.promisifyAll(gift('.'));

var repo = null;
var user = null;

git.configAsync()
.then(function(config){
  var remote = config.items['remote.origin.url'];

  var parts = remote.split('/');
  repo = parts.pop().replace(/\.git/ig, '');

  if (url.parse(remote).protocol){ // remote is a url
    user = parts.pop();
  } else { // remote is an ssh link - git@github.com:username
    user = parts.pop().split(':')[1];
  }
})
.then(function(){
  return ghauth(authOptions);
})
.then(function(authData){
  if (!authData.token) return;
  var ghib = new Ghib({
    user: user
  , repo: repo
  , token: authData.token
  , directory: '.'
  });

  return ghib.createBranch(Math.abs(parseInt(process.argv[2])));
})
.catch(function(error){
  console.error(error);
});
