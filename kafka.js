const kafkaService = require('./services/kafkaService');
const Message = require('./models/Message');
const messageController = require('./controllers/messageController');

const start = async() => {
    await kafkaService.consume('OUTGOING_MESSAGE', async (message) => {
        console.log(message)
        await messageController.processMessage(message);

    });
}

module.exports = {start}