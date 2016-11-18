const util = require('../util.js');
const constraints = require('./constraints.js');

/**
 * Assign a constraint to a member and a client
 * @param  {Array} members     All of the joining members
 * @param  {Object} client     The enquiring client
 * @return {Object}            The chosen constraint, assignee and client
 */
module.exports = function pick(members, client) {
  return {
    constraint: util.random(constraints),
    assignee: util.random(members),
    client: client
  };
}
