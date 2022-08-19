var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
exports.io = io
const routes = require("./routes");

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/messages", routes);

io.on('connection', () => {
    console.log('a user connected')
  })

var server = http.listen(process.env.PORT || 3000, () => {
    console.log('server is listening on port', server.address().port)
})