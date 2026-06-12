import sql from 'mssql'
import jwt from 'jsonwebtoken'
import argon from 'argon'
export default function userExists({userName='',email='',password=''}){
    if(username && email){
        const results = await sql.query(`
        SELECT username,email 
        FROM users
        WHERE username=${userName} OR email=${email}
        `)
        return Object.values(results).length > 0  
    }
    else if (email && password){
        const results = await sql.query(`
        SELECT username,email,password
        FROM users
        WHERE email=${email}
        `)
        const unhashed_password = await argon.verify(process.env.jwtKey,results.output?.password )
        return unhashed_password == password ? {status:true,results:results.output} : {status:false,results:null}
    }          
}