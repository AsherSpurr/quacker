### ⭐️This is a work in progress in the very early stages!⭐️
### The goal of this project is not to save time but to learn a lot of new tech and concepts.

# What is the current roadmap?
- ✅ Build out a rudimentary front-end to get some experience with Next
- ✅ Create the database schema using drawsql
- ✅ Create fundamental tables and functions necessary to the DB and seed with data
- 📍 Circle back to front-end to add to and restructure as needed - adding some functionality with mock data
- 📍 Add feeds and feeds_quacks tables
- 📍 Migrate front-end to fetch seeded data instead of mock data
- 📍 Implement Redis once some functionality is in place
- ⭐️ Pause and assess the current state. Make decisions about CDN's, if an algorithm will be used for feed/which one, React Native, type of load balancing (since using Next), which AWS to use first, etc.
- 📍 Add login - ideally using Oauth
- 📍 Next steps based on previous assessment 

# Why are we using certain tech?
The decision to use certain tech was purely based on learning goals.
Certain tech being used aren't the perfect pairing, but seamless pairing of tech wasn't the goal! This is why you may see the stack and go...what?

# Project Goals, learn a little about a lot - Twitter(x) clone 
- Use Next.js to gain experience with Server Side Rendering and better SEO
- Build out more complex databases using PostgreSQL
- Gain experience with serverless architecture
- Use React Native to explicitly make a mobile forward app
- Use Redis for its persistence and  replication 
- Migrate to use RDS for database management
- Migrate to Amazon's EC2 for improved scalability
- Learn about request throttling, caching, content delivery networks (CDN's), and load balancing

### To see the current progress

```
git clone git@github.com:AsherSpurr/quacker.git
cd quacker
pnpm install

```

**NOTE Node must be version 20 or higher**
To install Node
```nvm install <version>```
To use a specific version
```nvm use <version>```


Open [http://localhost:3000](http://localhost:3000) or the specified address in the terminal window with your browser to see the result.

