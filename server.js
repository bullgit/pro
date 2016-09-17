const request = require('request');
const dispatcher = require('httpdispatcher');
const http = require('http');
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
  };
}

/**
 * get the members who joined the bullgit pro™ program
 * @param  {String} url     The url where all of the members are defined (for example https://bullg.it/members.json)
 * @return {Promise(Array)} All of the members with {pro: true}
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
  // console.log(pick(constraints, members, 'client'));
}).catch(err => {
  console.error(err);
});


function serve(port) {
  console.log('serving');
  return new Promise((resolve, reject) => {
    port = port || 8000;

    // handle a request
    function handleRequest(request, response) {
      try {
        // log the request on console
        // TODO: delete this in prod
        console.log(request.url);
        // Dispatch
        dispatcher.dispatch(request, response);
      } catch (err) {
        // TODO: use sentry
        console.error(err);
      }
    }

    dispatcher.onPost('/request', function(req, res) {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(`Got Post Data: ${JSON.stringify(req.params)}`);
    });

    // serve the index
    // dispatcher.onGet('/', (req, res) => {
    //   const options = {};
    //   const data = {
    //     title,
    //     source
    //   };
    //   res.end(pug.renderFile(path.join(__dirname, '/../lib/index.pug'), {
    //     options,
    //     data
    //   }));
    // });

    dispatcher.onGet('/', (req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(`
<form action="/request" method="post">
  <input type="text" id="title" name="title" placeholder="title">
  <textarea name="message" id="message" placeholder="message"></textarea>
  <input type="submit">
</form>`);
    });

    // create a server
    const server = http.createServer(handleRequest);

    // start the server
    server.listen(port, () => {
      resolve(`Server listening on: ${port}`);
    });

    server.on('error', err => {
      switch (err.code) {
        case 'EACCES':
          reject('You don\'t have enough permissions to run on this port. Try running this with sudo.');
          break;
        case 'EADDRINUSE':
          reject('This address (or port) is already in use. Try changing the port.');
          break;
        default:
          reject('There was an error with code', err.code, '\nand message', err.message);
          break;
      }
    });
  });
}

serve(8008).then(res => {
  console.log(res);
}).catch(err => {
  console.error(`There was an error serving the provided datafeed:\n${err}`);
});

// answer to requests
// fetch bullgit members (https://bullg.it/members.json)
// pick a member and constraint
// give an answer to the client
// send emails, trello and gitter
