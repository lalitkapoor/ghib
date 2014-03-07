#!/usr/bin/env node

var url = require('url');
var Promise = require('bluebird');
var gift = require('gift');
var ghauth = Promise.promisify(require('ghauth'));
var Ghib = require('../lib/ghib');

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

  return ghib.createBranch(process.argv[2]);
})
.catch(function(error){
  console.error(error);
});
