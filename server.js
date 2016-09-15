const https = require('https');
const util = require('./util.js');
const constraints = require('./constraints.json');

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
  }
}

/**
 * get the members who joined the bullgit pro™ program
 * @param  {String} url the url where all of the members are defined (for example https://bullg.it/members.json)
 * @return {Array}      All of the members with {pro: true}
 */
function getMembers(url) {
  const availableMembers = [];
  return availableMembers;
}

// answer to requests
// fetch bullgit members (https://bullg.it/members.json)
// pick a member and constraint
// give an answer to the client
// send emails, trello and gitter
