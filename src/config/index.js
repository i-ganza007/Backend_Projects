const dotenv = require('dotenv')
dotenv.config()
console.log(process.env.PORT);

module.exports = {
    PORT : process.env.PORT
}