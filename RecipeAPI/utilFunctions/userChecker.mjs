import { db } from '../index.js'
import argon2 from 'argon2'

export default async function userExists({userName='',email='',password=''}){
    if(userName && email){
        const [rows] = await db.query(
            'SELECT user_name, email FROM USERS WHERE user_name = ? OR email = ?',
            [userName, email]
        )
        return rows.length > 0
    }
    else if (email && password){
        const [rows] = await db.query(
            'SELECT user_name, email, password FROM USERS WHERE email = ?',
            [email]
        )
        if (rows.length === 0) return {status: false, results: null}
        const valid = await argon2.verify(rows[0].password, password)
        return valid ? {status: true, results: rows[0]} : {status: false, results: null}
    }
}