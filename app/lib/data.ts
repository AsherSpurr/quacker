import { sql } from "@vercel/postgres";
import { Quack, Relationships } from "./definitions";

//Update this function to only show quacks from following list
export async function fetchQuacks(userId: string) {
    try {
        const data = await sql<Quack>`
            SELECT *
            FROM quacks q
            INNER JOIN relationships r
                ON r.followee_id = q.user_id
            WHERE r.follower_id = ${userId}
            ORDER BY q.created_at DESC;
        `;
        return data.rows;
    } catch (error){
        throw new Error(`Failed to fetch Quacks. ${error}`) //Update for better error handling
    }
}

export async function updateRelationships(followee_id: any, follower_id: any) {
    try {
        const data = await sql<Relationships>`
            INSERT INTO relationships (followee_id, follower_id)
                VALUES (${followee_id}, ${follower_id})
                ON CONFLICT (follower_id, followee_id)
                DO NOTHING
            RETURNING *
        `;
        return data.rows;
    } catch (error){
        throw new Error(`Failed to complete. ${error}`) // Remove throw
    }
}

// updateRelationships('84caebab-ea4a-4a38-9836-9e080aabc639', '0728b9ce-f89a-4232-a1a1-82ec7fb60371')