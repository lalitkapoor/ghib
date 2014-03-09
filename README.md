ghib [![NPM version](https://badge.fury.io/js/ghib.png)](http://badge.fury.io/js/ghib)
====

**create meaningful git branch names (based on github issues) easily**

[![NPM](https://nodei.co/npm/ghib.png)](https://nodei.co/npm/ghib/)

I try and create meaningful issue titles on GitHub and I found it annoying to
retype the same thing execpt with dashes when I create branches to work on those
issues.

For example I opened an issue titled: _auto detect owner and repository_. It got
assigned an issue number: _6_. Now whenever I decide to start working on that
issue I'd like to be able to create a branch name for it quickly. Preferably
something that will quickly let me know what issue I'm working on and something
that will be meaningful.

Issue Number: `#6` Issue Title: `auto detect owner and repository`

The following branch is created: `6-auto-detect-owner-and-repository` by
executing `ghib 6` in my project directory

### Installation

```
npm install -g ghib
```

### Usage
While you are in your project directory do the following and a branch will be
created for you (checkout master or whatever branch you need to first if
necessary, so the branch is created with the right parent).

```
ghib <githubIssueNumber>
```
