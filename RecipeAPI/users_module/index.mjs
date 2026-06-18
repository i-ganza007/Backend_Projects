import express from 'express'
import { db } from '../index.js'
import userExists from '../utilFunctions/userChecker.mjs'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import {node_mailer} from '../mailing_conf/index.mjs'


/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: StrongPass123
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: StrongPass123
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Created a user
 *       409:
 *         description: User with the email or username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User with the email or username Exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal server error
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         headers:
 *           Authorization:
 *             schema:
 *               type: string
 *             description: Bearer JWT token
 *             example: Bearer eyJhbGciOiJIUzI1NiIs...
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User Logged In
 *       401:
 *         description: Invalid credentials
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Unauthorized User
 */

/**
 * @swagger
 * /users/test:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Service is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Working Fine
 */



const user_router = express.Router()

user_router.post('/signup', async (req,res)=>{
    const {username, email, password} = req.body
    if(await userExists({userName: username, email})){
        return res.status(409).json('User with the email or username Exists')
    }
    try {
        const hash_pass = await argon2.hash(password)
        await db.query(
            'INSERT INTO USERS(user_name, email, password) VALUES(?, ?, ?)',
            [username, email, hash_pass]
        )
        res.status(201).json('Created a user')
        console.log(node_mailer(email))
    } catch (error) {
        res.status(500).json(error.message)
    }
})

user_router.post('/login', async (req,res)=>{
    const {email, password} = req.body
    const {status, results} = await userExists({email, password})
    if(status){
        const jwt_token = jwt.sign({user_name: results.user_name, email: results.email}, process.env.jwtKey, {expiresIn: '2h'})
        res.status(200).header('Authorization',`Bearer ${jwt_token}`).send('User Logged In')
    }
    else{
        res.status(401).send('Unauthorized User')
    }
})

user_router.get('/test',(req,res)=>{
    res.send('Working Fine')
})




export default user_router

