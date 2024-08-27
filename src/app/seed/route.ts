import bcrypt from "bcrypt";
import { db } from '@vercel/postgres';
import {users} from '../lib/placeholder-data';
const client = await db.connect();

async function seedUsers() {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
        CREATE TABLE IF NOT EXISTS users (
            user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255),
            email VARCHAR(255) NOT NULL UNIQUE,
            password_digest VARCHAR(255) NOT NULL,
            slug VARCHAR(50) NOT NULL UNIQUE,
            avatar TEXT,
            bio TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `;

    const insertedUsers = await Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password_digest, 10);
            return client.sql`
                INSERT INTO users (name, email, password_digest, slug, avatar, bio)
                VALUES (${user.name}, ${user.email}, ${hashedPassword}, ${user.slug}, ${user.avatar}, ${user.bio})
                ON CONFLICT (id, email, slug) DO NOTHING;
            `;
        })
    );
    return insertedUsers;
}