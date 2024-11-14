import bcrypt from "bcrypt";
import { db, QueryResultRow } from "@vercel/postgres";
import { quacks, users } from "../lib/placeholder-data";
import { NextResponse } from "next/server";
const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
        CREATE TABLE IF NOT EXISTS users (
            user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_digest VARCHAR(255) NOT NULL,
            slug VARCHAR(50) UNIQUE NOT NULL,
            avatar TEXT,
            bio VARCHAR(300),
            created_at TIMESTAMP DEFAULT NOW()
        );
    `;

  await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password_digest, 10);
      try {
        await client.sql`
                  INSERT INTO users (name, email, password_digest, slug, avatar, bio)
                  VALUES (${user.name}, ${user.email}, ${hashedPassword}, ${user.slug}, ${user.avatar}, ${user.bio})
                  ON CONFLICT (email) DO NOTHING;
              `;
      } catch (error: any) {
        if (error.code === "23505") {
          return { message: "An account with this email already exists" };
        }
      }
    })
  );
  const { rows: userRows } = await client.sql`SELECT user_id, email FROM users`;
  const userIdMap = userRows.reduce((map, user) => {
    map[user.email] = user.user_id;
    return map;
  }, {});
  return userIdMap;
}

async function seedQuacks(userIdMap: QueryResultRow) {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
        CREATE TABLE IF NOT EXISTS quacks (
            quack_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            content VARCHAR(600) NOT NULL,
            media_url TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        );
    `;
  await client.sql`
    CREATE INDEX IF NOT EXISTS idx_quacks_user_id ON quacks (user_id);
    CREATE INDEX IF NOT EXISTS idx_quacks_created_at ON quacks (created_at);
    `;
  await Promise.all(
    quacks.map(async (quack) => {
      const user_id = userIdMap[quack.email];
      return client.sql`
                INSERT INTO quacks (user_id, content, media_url)
                VALUES (${user_id}, ${quack.content}, ${quack.media_url})
            `;
    })
  );
  const { rows: quackRows } =
    await client.sql`SELECT quack_id, content FROM quacks`;
  const quackIdMap = quackRows.reduce((map, quack) => {
    map[quack.content] = quack.quack_id;
    return map;
  }, {});

  return quackIdMap;
}

async function seedRelationships(userIdMap: QueryResultRow) {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
        CREATE TABLE IF NOT EXISTS relationships (
            follower_id UUID NOT NULL,
            followee_id UUID NOT NULL,
            PRIMARY KEY (follower_id, followee_id),
            FOREIGN KEY (follower_id) REFERENCES users (user_id),
            FOREIGN KEY (followee_id) REFERENCES users (user_id)
        );
    `;
  await client.sql`
        CREATE INDEX IF NOT EXISTS idx_relationships_follower_id ON relationships (follower_id);
        CREATE INDEX IF NOT EXISTS idx_relationships_followee_id ON relationships (followee_id);
    `;

  const relationships = [
    { follower: "myemail1@example.com", followee: "myemail2@example.com" },
    { follower: "myemail3@example.com", followee: "myemail1@example.com" },
    { follower: "myemail2@example.com", followee: "myemail3@example.com" },
  ];
  const insertedRelationships = await Promise.all(
    relationships.map(async (relationship) => {
      const follower_id = userIdMap[relationship.follower];
      const followee_id = userIdMap[relationship.followee];
      return client.sql`
                INSERT INTO relationships (follower_id, followee_id)
                VALUES (${follower_id}, ${followee_id})
                ON CONFLICT (follower_id, followee_id) DO NOTHING;
            `;
    })
  );
  return insertedRelationships;
}

async function seedLikes(
  userIdMap: QueryResultRow,
  quackIdMap: QueryResultRow
) {
  await client.sql`
        CREATE TABLE IF NOT EXISTS likes (
            like_id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL,
            quack_id UUID NOT NULL,
            UNIQUE(user_id, quack_id)
        );
    `;
  await client.sql`
    CREATE TABLE IF NOT EXISTS likes_count (
        quack_id UUID PRIMARY KEY,
        like_count INT DEFAULT 0,
        FOREIGN KEY (quack_id) REFERENCES quacks (quack_id)
    );
`;
  await client.sql`
    DROP TRIGGER IF EXISTS update_like_count_trigger ON likes;
    DROP FUNCTION IF EXISTS update_like_count;
    
    CREATE OR REPLACE FUNCTION update_like_count() RETURNS TRIGGER AS $$
    BEGIN
        IF TG_OP = 'INSERT' THEN 
            INSERT INTO likes_count (quack_id, like_count)
            VALUES (NEW.quack_id, COALESCE((SELECT lc.like_count FROM likes_count lc WHERE lc.quack_id = NEW.quack_id), 0) +1)
            ON CONFLICT (quack_id) DO UPDATE SET like_count = likes_count.like_count + 1;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE likes_count
            SET like_count = like_count - 1
            WHERE quack_id = OLD.quack_id;
            DELETE FROM likes_count WHERE like_count <= 0;
        END IF;
        RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER update_like_count_trigger
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW
    EXECUTE FUNCTION update_like_count();
    `;

  const likes = [
    { email: "myemail1@example.com", quack: "quack from user 2" },
    { email: "myemail3@example.com", quack: "quack from user 4" },
  ];

  await Promise.all(
    likes.map(async (like) => {
      const user_id = userIdMap[like.email];
      const quack_id = quackIdMap[like.quack];
      return client.sql`
                INSERT INTO likes (user_id, quack_id)
                VALUES (${user_id}, ${quack_id})
                ON CONFLICT (user_id, quack_id) DO NOTHING;
            `;
    })
  );
}

// Run the seeding functions
export async function GET() {
  try {
    const userIdMap = await seedUsers();
    const quackIdMap = await seedQuacks(userIdMap);
    await seedRelationships(userIdMap);
    await seedLikes(userIdMap, quackIdMap);
    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
