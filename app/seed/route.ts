import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
import { likes, quacks, relationships, users } from "../lib/placeholder-data";
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
            bio VARCHAR(300),
            created_at TIMESTAMP DEFAULT NOW()
        );
    `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password_digest, 10);
      return client.sql`
                INSERT INTO users (name, email, password_digest, slug, avatar, bio)
                VALUES (${user.name}, ${user.email}, ${hashedPassword}, ${user.slug}, ${user.avatar}, ${user.bio})
                ON CONFLICT (slug) DO NOTHING
                ON CONFLICT (email) DO NOTHING;
            `;
    })
  );
  return insertedUsers;
}

async function seedQuacks() {
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
    CREATE INDEX IF NOT EXISTS idx_quacks_created_at_10_days ON quacks (created_at) WHERE created_at >= NOW() - INTERVAL '10 days';
    `;
  const insertedQuacks = await Promise.all(
    quacks.map(async (quack) => {
      return client.sql`
                INSERT INTO quacks (user_id, content, media_url)
                VALUES (${quack.user_id}, ${quack.content}, ${quack.media_url})
                ON CONFLICT (user_id, content, media_url) DO NOTHING;
            `;
    })
  );
  return insertedQuacks;
}

async function seedRelationships() {
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
  const insertedRelationships = await Promise.all(
    relationships.map(async (relationship) => {
      return client.sql`
                INSERT INTO relationships (follower_id, followee_id)
                VALUES (${relationship.follower_id}, ${relationship.followee_id})
                ON CONFLICT (follower_id, followee_id) DO NOTHING;
            `;
    })
  );
  return insertedRelationships;
}

async function seedLikes() {
  await client.sql`
        CREATE TABLE IF NOT EXISTS likes (
            like_id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL,
            quack_id UUID NOT NULL
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
    CREATE OR REPLACE FUNCTION update_like_count() RETURNS TRIGGER AS $$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO likes_count (quack_id, like_count)
            VALUES (NEW.quack_id, COALESCE((SELECT like_count FROM likes_count WHERE quack_id = NEW.quack_id), 0) +1)
            ON CONFLICT (quack_id) DO UPDATE SET like_count = like_count + 1;
        ELSEIF TG_OP = 'DELETE' THEN
            UPDATE likes_count
            SET like_count = like_count - 1
            WHERE quack_id = OLD.quack_id;
            DELETE FROM likes_count WHERE like_count <= 0;
        END IF;
        RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;
`;
  await client.sql`
    CREATE TRIGGER update_like_count_trigger
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW
    EXECUTE FUNCTION update_like_count();
`;
  const insertedLikes = await Promise.all(
    likes.map(async (like) => {
      return client.sql`
                INSERT INTO likes (user_id, quack_id)
                VALUES (${like.user_id}, ${like.quack_id})
                ON CONFLICT (user_id, quack_id) DO NOTHING;
            `;
    })
  );
  return insertedLikes;
}

export async function GET() {
    try {
        await client.sql`BEGIN`;
        await seedUsers();
        await seedQuacks();
        await seedRelationships();
        await seedLikes();
        await client.sql`COMMIT`;

        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
      await client.sql`ROLLBACK`;
      return Response.json({ error }, { status: 500 });
    }
}
