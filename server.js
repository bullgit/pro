const request = require('request');
const util = require('./util.js');
const constraints = require('./constraints.json');
const dispatcher = require('httpdispatcher');

/**
 * Assign a constraint to a member and a client
 * @param  {Array} constraints All of the possible constraints
 * @param  {Array} members     All of the joining members
 * @param  {Object} client     The enquiring client
 * @return {Object}            The chosen constraint, assignee and client
 */
function pick(constraints, members, client) {
  return {
    constraint: util.random(constraints),
    assignee: util.random(members),
    client: client
  };
}

/**
 * get the members who joined the bullgit pro™ program
 * @param  {String} url the url where all of the members are defined (for example https://bullg.it/members.json)
 * @return {Promise(Array)}     All of the members with {pro: true}
 */
function getMembers(url) {
  return new Promise(function(resolve, reject) {
    let availableMembers = [];

    request({
      url,
      json: true
    }, function(err, res, body) {
      if (err) {
        reject(err);
      }

      availableMembers = body.gitches.filter(member => {
        return member.pro;
      });

      resolve(availableMembers);
    });
  });
}

getMembers('https://bullg.it/members.json').then(members => {
  console.log(pick(constraints, members, 'client'));
}).catch(err => {
  console.error(err);
});

// answer to requests
// fetch bullgit members (https://bullg.it/members.json)
// pick a member and constraint
// give an answer to the client
// send emails, trello and gitter
