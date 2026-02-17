#!/bin/sh

# This script is used as an entrypoint for the seeder service in Docker.
# It waits for MongoDB to be ready before running the seed script.

echo "⏳ Waiting for MongoDB at $MONGODB_URI..."

# Simple wait loop using mongosh or just waiting a bit
# Since we are in an alpine/node image, we can use a small node script to check connection
node -e "
const mongo = require('mongoose');
const tryConnect = async () => {
  try {
    await mongo.connect('$MONGODB_URI');
    console.log('✅ MongoDB is ready!');
    process.exit(0);
  } catch (e) {
    process.exit(1);
  }
};
tryConnect();
"
while [ $? -ne 0 ]; do
  sleep 2
  node -e "
  const mongo = require('mongoose');
  const tryConnect = async () => {
    try {
      await mongo.connect('$MONGODB_URI');
      process.exit(0);
    } catch (e) {
      process.exit(1);
    }
  };
  tryConnect();
  "
done

echo "🌱 Starting database seeding..."
# We use the dev modules from the builder stage or just standard ts-node
npx ts-node --transpile-only -P /dev/null --compiler-options '{"module":"commonjs"}' scripts/seed.ts

echo "✅ Seeding completed."
