import { sql } from "@vercel/postgres";
import { Quack } from "./definitions";

export async function fetchUser(id: string) {

}

//Update this function to only show quacks from following list
export async function fetchQuacks() {
    try {
        const data = await sql<Quack>`SELECT * FROM quacks`;
        return data.rows;
    } catch (error){
        throw new Error(`Failed to fetch Quacks. ${error}`) //Update for better error handling
    }
}
