import { sql } from "@vercel/postgres";
import { Quack } from "./definitions";
// import pg from 'pg';

// const { Pool } = pg;

// const db_session = new Pool({
//   connectionString: process.env.POSTGRES_URL,
// })
// db_session.connect()
//     .then(() => console.log('Connected to PostgreSQL database'))
//     .catch(err => console.error('Connection error', err.stack));
// export async function fetchUser(id: string) {

// }
//Update this function to only show quacks from following list
export async function fetchQuacks(userId: string) {
    try {
        const data = await sql<Quack>`
            SELECT *
            FROM quacks q
            INNER JOIN relationships r
                ON r.followee_id = q.user_id
            WHERE r.follower_id = ${userId} OR q.user_id = ${userId}
            ORDER BY q.created_at DESC;
        `;
        return data.rows;
    } catch (error){
        throw new Error(`Failed to fetch Quacks. ${error}`) //Update for better error handling
    }
}
