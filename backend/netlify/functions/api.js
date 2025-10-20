const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(MONGODB_URI);
  cachedClient = client;
  return client;
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();
    const collection = db.collection('profiles');

    if (event.httpMethod === 'GET') {
      let profile = await collection.findOne();
      
      if (!profile) {
        profile = {
          firstName: 'John',
          lastName: 'Doe',
          title: 'Software Developer',
          imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        };
        await collection.insertOne(profile);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(profile)
      };
    }

    if (event.httpMethod === 'PUT') {
      const data = JSON.parse(event.body);
      const { firstName, lastName, title, imageUrl } = data;

      let profile = await collection.findOne();

      if (profile) {
        await collection.updateOne(
          { _id: profile._id },
          { $set: { firstName, lastName, title, imageUrl } }
        );
      } else {
        await collection.insertOne({ firstName, lastName, title, imageUrl });
      }

      profile = await collection.findOne();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(profile)
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};