

export const quacks = [
  {
    quack_id: 1, 
    user_id: 2,
    created_at: new Date(),
    content: "quack from user 2",
    media_url: "https://avatars.githubusercontent.com/u/68473548?v=4",
  },
  {
    quack_id: 3, 
    user_id: 4,
    created_at: new Date(),
    content: "quack from user 4",
    media_url: "",
  },
  {
    quack_id: 5, 
    user_id: 6,
    created_at: new Date(),
    content: "quack from user 6",
    media_url: "https://avatars.githubusercontent.com/u/68473548?v=4",
  },
  {
    quack_id: 7, 
    user_id: 8,
    created_at: new Date(),
    content: "quack from user 8",
    media_url: null,
  },
];

export const users = [
    {
        name: "",
        email: "myemail1@example.com",
        password_digest: "<PASSWORD>",
        slug: "BBy789",
        feeds_id: 1,
        avatar: "https://avatars.githubusercontent.com/u/68473548?v=4",
        bio: "bio1",
    },
    {
        name: "user2",
        email: "myemail2@example.com",
        password_digest: "<PASSWORD>",
        slug: "slayer",
        feeds_id: 3,
        avatar: "https://avatars.githubusercontent.com/u/68473548?v=4",
        bio: "bio2",
    },
    {
        name: "",
        email: "myemail3@example.com",
        password_digest: "<PASSWORD>",
        slug: "idk",
        feeds_id: 5,
        avatar: "https://avatars.githubusercontent.com/u/68473548?v=4",
        bio: "bio3",
    },
    {
        name: "user4",
        email: "myemail4@example.com",
        password_digest: "<PASSWORD>",
        slug: "manoise",
        feeds_id: 7,
        avatar: "https://avatars.githubusercontent.com/u/68473548?v=4",
        bio: "bio3",
    }
]

export const relationships = [
    {
        follower_id: 2,
        followee_id: 4,
    },
    {
        follower_id: 4,
        followee_id: 2,
    },
    {
        follower_id: 4,
        followee_id: 6,
    }
]

export const likes = [
    {
        user_id: 2,
        quack_id: 1,
    },
    {
        user_id: 4,
        quack_id: 3,
    },
    {
        user_id: 6,
        quack_id: 5,
    }
]