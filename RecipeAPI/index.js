import express from 'express'
import http from 'http'
import user_router from './users_module/index.mjs'
import mysql2 from 'mysql2'
import { loadEnvFile } from 'process'


const app = express()
const server = http.createServer(app)
loadEnvFile()
const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export const db = mysql2.createPool(config).promise()



app.use('/users',user_router)


app.all('/',(req,res)=>{
    res.json('Welcome to the Recipe API')
})

const startupFunc = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS USERS (
                userId INT AUTO_INCREMENT PRIMARY KEY,
                user_name VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            )
        `)
        console.log('Users table ready')
    } catch (error) {
        console.error(error)
    }
}

async function bootstrap() {
    await db.query('SELECT 1')
    console.log('Connected to DB')

    await startupFunc()

    server.listen(5000, '0.0.0.0',() => {
        console.log('Server running on port 5000')
    })
}

bootstrap().catch(console.error)