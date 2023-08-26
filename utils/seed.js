const mongoose = require('mongoose');
const faker = require('faker');
const User = require('../models/User');
const Thought = require('../models/Thought');

mongoose.connect('mongodb://127.0.0.1:27017/socialnetDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDatabase() {
  try {
    await User.deleteMany({});
    await Thought.deleteMany({});

    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = new User({
        username: faker.internet.userName(),
        email: faker.internet.email(),
      });
      users.push(await user.save());
    }

    // Create friend relationships
    for (const user of users) {
      const numFriends = faker.datatype.number({ min: 1, max: 5 });
      const friends = [];
      while (friends.length < numFriends) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (randomUser._id !== user._id && !friends.includes(randomUser._id)) {
          friends.push(randomUser._id);
        }
      }
      user.friends = friends;
      await user.save();
    }

    const thoughts = [];
    for (let i = 0; i < 20; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const thought = new Thought({
        thoughtText: faker.lorem.sentences(1),
        username: user.username,
      });
      thoughts.push(await thought.save());
      user.thoughts.push(thought);
      await user.save();
    }

    for (let i = 0; i < 30; i++) {
      const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
      if (thought) {
        thought.reactions.push({
          reactionBody: faker.lorem.sentence(),
          username: users[Math.floor(Math.random() * users.length)].username,
        });
        await thought.save();
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
