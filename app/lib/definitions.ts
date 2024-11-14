import { StaticImageData } from "next/image"

export type User = {
    user_id: number,
    name: string | null,
    email: string,
    password_digest: string,
    slug: string,
    feeds_id: number,
    avatar: string | null,
    bio: string,
    created_at: Date,
}

export type Quack = {
    quack_id: number, 
    user_id: number,
    created_at: Date,
    content: string,
    media_url: string | null, //change back to string
}

export type Feed = Quack[]

export type Relationships = {
    follower_id: number,
    following_id: number,
}