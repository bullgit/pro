const got = require('got');

/**
 * get the members who joined the bullgit pro™ program
 * @param  {String} url     The url where all of the members are defined (for example https://bullg.it/members.json)
 * @return {Promise(Array)} All of the members with {pro: true}
 */
module.exports = function getMembers(url) {
  return new Promise((resolve, reject) => {
    got(url, {
      json: true
    }).then(response => {
      const availableMembers = response.body.gitches.filter(member => {
        return member.pro;
      });

      resolve(availableMembers);
    }).catch(reject);
  });
}
