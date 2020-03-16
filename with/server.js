

const app = require('express')();
const server = require('http').server(app);
const io = require('socket.io')(server);
const next = require('next');

const port = parseint(process.env.port, 10) || 3000;
const dev = process.env.node_env !== 'production';
const nextapp = next({ dev });
const nexthandler = nextapp.getrequesthandler();

// fake db
const messages = {
  chat1: [],
  chat2: [],
};

// socket.io server
io.on('connection', socket => {
  socket.on('message.chat1', data => {
    messages['chat1'].push(data);
    socket.broadcast.emit('message.chat1', data)
  });
  socket.on('message.chat2', data => {
    messages['chat2'].push(data)
    socket.broadcast.emit('message.chat2', data)
  })
});

nextapp.prepare().then(() => {
  app.get('/messages/:chat', (req, res) => {
    res.json(messages[req.params.chat])
  });

  app.get('*', (req, res) => {
    return nexthandler(req, res)
  });

  server.listen(port, err => {
    if (err) throw err
    console.log(`> ready on http://localhost:${port}`)
  })
});
