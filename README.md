# Projector HSA Home work #11: Redis

## Todo:

1. Build master-slave redis cluster using Redis Sentinel.
2. Try all eviction strategies.
3. Create API with a wrapper for Redis Client that implement probabilistic cache.

## Results:

1. Docker compose file with [`docker-compose.yml`](./docker-compose.yml):
   - Master-slave redis cluster using Redis Sentinel.
   - MySQL container.
   - API container.
2. Created API [`index.js`](./api/index.js) with a wrapper [`redis/client.js`](./api/redis/client.js) for Redis Client that implement probabilistic cache.
3. Tested all eviction strategies.

## How to run:

1. Clone the repository.
2. Run `docker compose up -d --build`.

## How to test:

1. Run `curl -X POST http://localhost:3000/user -H "Content-Type: application/json" -d '{"email": "test@test.com"}'` to create a user.
2. Run `curl http://localhost:3000/user/1` to get the user.
3. Run `curl http://localhost:3000/user-db/1` to get the user from the database.
