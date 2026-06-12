import express from 'express'
import sql from 'mssql'
import userExists from '../utilFunctions/userChecker'
import argon from 'argon'
import jwt from 'jsonwebtoken'
import {node_mailer} from '../mailing_conf'

const user_router = express.Router()

user_router.post('/signup',(req,res)=>{
    const {username, email,password} = req.body
    if(userExists({username,email})){
        res.status(502).json('User with the email or username Exists')
    }
    else{
        try {
        const hash_pass = await argon.hash(process.env.passwordHash,password)
        sql.query(`INSERT INTO USERS(user_name,email,password)
            VALUES(${username},${email},${hash_pass})            
            `)
        res.status(201).json('Created a user')
        console.log(node_mailer(email))   
        } catch (error) {
            res.status(500).json(error)
        }
    }

})

user_router.post('/login',(req,res)=>{
    const {email,password} = req.body
    const {status,results} = userExists({email,password})
    if(status){
        const jwt_token = await jwt.sign(results,process.env.jwtKey,{expiresIn:'2hr'})
        res.status(200).header('Authorization',`Bearer ${jwt_token}`).send('User Logged In')
    }
    else{
        res.status(401).send('Unauthorized User')
    }
})




export default user_router

