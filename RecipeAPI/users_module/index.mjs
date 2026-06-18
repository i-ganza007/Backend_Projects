import express from 'express'
import { db } from '../index.js'
import userExists from '../utilFunctions/userChecker.mjs'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import {node_mailer} from '../mailing_conf/index.mjs'

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

