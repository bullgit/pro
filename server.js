const HttpDispatcher = require('httpdispatcher');
const http = require('http');
const getMembers = require('./lib/getMembers.js');
const pickConstraint = require('./lib/pickConstraint.js');

const dispatcher = new HttpDispatcher();

/**
 * Serve the application on a certain port
 * @param  {Number=8000} port the port to serve on
 * @return {Promise}      Resolves when application starts
 */
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
        'Content-Type': 'text/html; charset=utf-8'
      });
      const request = req.params;
      getMembers('https://bullg.it/members.json').then(members => {
        const constraint = pickConstraint(members, 'client');
        res.end(`
<meta charset="UTF-8">
<h1>Nice!</h1>
<p>Our trained professional <em><a href="${constraint.assignee.url}">${constraint.assignee.name}</a></em> will now start working on: </p>
<p><strong>${request.title}</strong></p>
<p>With comment: </p>
<blockquote>
  ${request.message}
</blockquote>
<p>All while taking in account to <em>${constraint.constraint}</em></p>`);
      }).catch(err => {
        res.end(err);
      });
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
        'Content-Type': 'text/html; charset=utf-8'
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
