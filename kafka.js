const kafkaService = require('./services/kafkaService');
const messageController = require('./controllers/messageController');
const logger = require('./utils/logger');
const start = async() => {
    await kafkaService.consume('OUTGOING_MESSAGE', async ({message, traceId}) => {
        logger.info(`message`, {traceId})
        await messageController.processMessage({...message, traceId});

    });
}

module.exports = {start}