const dotenv = require ('dotenv')
dotenv.config();

const token = process.env.TOKEN;
const channelId = process.env.Channel_ID;

module.exports = {
    token,
    channelId
}
