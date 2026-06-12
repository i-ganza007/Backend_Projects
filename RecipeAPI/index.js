import express from 'express'
import http from 'http'
import user_router from './users_module'
import sql from 'mssql'
import { loadEnvFile } from 'process'


const app = express()
const server = http.createServer(app)
loadEnvFile()
const config = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  server: 'localhost',
  database: process.env.MYSQL_DATABASE,
};



app.use('/users',user_router)


app.all('/',(req,res)=>{
    res.json('Welcome to the Recipe API')
})

const startupFunc = async () => {
    try {
        await sql.query(`
            IF NOT EXISTS (
                SELECT * FROM sys.tables
                WHERE name = 'USERS'
            )
            BEGIN
                CREATE TABLE USERS (
                    userId INT IDENTITY(1,1) PRIMARY KEY,
                    user_name VARCHAR(50) NOT NULL UNIQUE,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL
                )
            END
        `)
        console.log('Users table ready')
    } catch (error) {
        console.error(error)
    }
}

async function bootstrap() {
    await sql.connect(config)

    console.log('Connected to DB')

    await startupFunc()

    server.listen(5000, () => {
        console.log('Server running on port 5000')
    })
}

bootstrap().catch(console.error)