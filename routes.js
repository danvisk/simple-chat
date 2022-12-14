const { Router } = require("express");
var mongoose = require('mongoose')
const { io } = require("./server")

const router = new Router();

var dbUrl = process.env.DB_URL || 'mongodb+srv://danvisk:415c390D@cluster0.zequcpl.mongodb.net/?retryWrites=true&w=majority';

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

router.get('/', (req, res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages)
    })
})

router.delete('/', async (req, res) => {
    console.log('delete was called')
    if(await Message.countDocuments({})) {
        io.emit('delete')
        let msg = { name: 'Bot', message: 'Someone requested to delete the chat history'}
        io.emit('message', msg)
        await Message.deleteMany()
        res.sendStatus(200)
    }    
    else {
        console.log('collection is already empty!')
        res.sendStatus(500)
    }    
})

router.post('/', async (req, res) => {
    
    try {
        if(req.body.message === 'badword')
            console.log('badword detected. Nothing saved')
        else {
            io.emit('message', req.body)
            let message = new Message(req.body)
            await message.save(); //let savedMessage = a
            console.log('message saved')
        }
        res.sendStatus(200)
    
    } catch (err) {
        res.sendStatus(500)
        console.error(err) // return this???
    }  
})

mongoose.connect(dbUrl, (err) => {
  console.log('mongo db connection', err)
})

module.exports = router;
