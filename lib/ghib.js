var Promise = require('bluebird');
var GitHubApi = require('github');
var gift = require('gift');

/**
 * Ghib
 * @constructor
 * @param {Object} options can contain the following:
 *   @param {String} user is whom the repo belongs to
 *   @param {String} repo is the name of the repo
 *   @param {String} token is used to make authenticated requests
 *   @param {String} directory is the local path to the git repository
 *   @param {Function} namer is used to customize the way branches are named
 */
var Ghib = module.exports = function(options) {
  if (!options.user) throw new Error('argument `user` is required');
  if (!options.repo) throw new Error('argument `repo` is required');
  if (!options.token) throw new Error('argument `token` is required');
  if (!options.directory) throw new Error('argument `directory` is required');
  if (options.namer && typeof(options.namer) !== 'function')
    throw new Error('argument `namer` must be a function');

  // new GitHubApi instance
  var github = new GitHubApi({
    version: '3.0.0'
  , timeout: 10000
  });

  Promise.promisifyAll(github.issues);
  Promise.promisifyAll(github.repos);

  var git = Promise.promisifyAll(gift(options.directory));

  /**
   * make authenticated github requests
   */
  var auth = function() {
    if (!options.token) return;
    github.authenticate({type: 'oauth', token: options.token});
  };

  /**
   * Create a meaningful branch name based on the github issue's info.
   * This can be overwritten if you'd like to customize the naming
   * @param issue is the github issue
   */
  var namer = function(issue) {
    // http://stackoverflow.com/a/4328546/568398
    var title = issue.title
      .replace(/[^\w\s_]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\s/g, '-')
    ;
    var branchName = issue.number + '-' + title;

    return branchName;
  }

  /**
   * Create a branch based on the given issue number and check it out
   * @param issueNo is the issue number we want to create a branch for
   */
  this.createBranch = function(issueNo, callback) {
    auth();

    return github.repos.getAsync({
      user: options.user
    , repo: options.repo
    })
    .then(function(repo){
      var issuesUser = null
      var issuesRepo = null;

      // detect who hosts the issues
      if (repo.has_issues) {
        var issuesUser = options.user;
        var issuesRepo = options.repo;
      } else if (repo.parent && repo.parent.has_issues) {
        var parts = repo.parent.full_name.split('/');
        issuesUser = parts[0];
        issuesRepo = parts[1];
      } else if (repo.source && repo.source.has_issues) {
        var parts = repo.source.full_name.split('/');
        issuesUser = parts[0];
        issuesRepo = parts[1];
      }

      // if there are no issues then return an error
      if (!issuesUser || !issuesRepo) {
        return Promise.reject(new Error('this repo does not have issues'));
      }

      return github.issues.getRepoIssueAsync({
        user: issuesUser
      , repo: issuesRepo
      , number: issueNo
      });
    })
    .then(function(issue){ // create branch name
      if (options.namer) return options.namer(issue);
      return namer(issue);
    })
    .then(function(branchName){ // create branch
      return git.create_branchAsync(branchName)
      .then(function(){
        return branchName;
      });
    })
    .then(function(branchName){ // checkout branch
      return git.checkoutAsync(branchName);
    })
    .nodeify(callback)
    ;
  };
};
