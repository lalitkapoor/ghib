ghib [![NPM version](https://badge.fury.io/js/ghib.png)](http://badge.fury.io/js/ghib)
====

**create git branches with meaningful names by specifying a GitHub issue number**

[![NPM](https://nodei.co/npm/ghib.png)](https://nodei.co/npm/ghib/)

### tl;dr

Issue Number: `#6` <br\> Issue Title: `auto detect owner and repository`

Executing `ghib 6` in my project directory. to quickly create the following 
branch and check it out: `6-auto-detect-owner-and-repository`.

### Details

Lets say I opened an issue titled: _auto detect owner and repository_. It got
assigned an issue number: _6_. Now whenever I decide to start working on that
issue I'd like to be able to create a branch name for it quickly. Preferably
something that will quickly let me know what issue I'm working on and something
that will be meaningful.

I use this to make me more productive in my workflow.

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
