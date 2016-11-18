const request = require('request');

/**
 * get the members who joined the bullgit pro™ program
 * @param  {String} url     The url where all of the members are defined (for example https://bullg.it/members.json)
 * @return {Promise(Array)} All of the members with {pro: true}
 */
module.exports = function getMembers(url) {
  return new Promise(function(resolve, reject) {
    request({
      url,
      json: true
    }, function(err, res, body) {
      if (err) {
        reject(err);
      }

      const availableMembers = body.gitches.filter(member => {
        return member.pro;
      });

      resolve(availableMembers);
    });
  });
}
