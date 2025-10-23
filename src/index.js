const express = require('express')
const http = require('http')
const {PORT} = require('./config/index')
const apiRoutes = require('./routes')
const {AboutController,HomeController} = require('./controllers')

const app = express()
http.createServer(app)

app.use('/api',apiRoutes)



app.listen(PORT,()=>{
    console.log(`Server Runinng ${PORT}`);
})
