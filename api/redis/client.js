const Redis = require("redis");

class RedisWrapper {
  constructor(options = {}) {
    this.beta = options.beta || 1; // Parameter for tuning early recomputation

    // Create Redis client
    this.client = Redis.createClient({
      url: "redis://redis-master:6379",
      sentinels: [
        {
          host: "redis-sentinel",
          port: 26379,
        },
      ],
      name: "mymaster",
    });

    // Error handling
    this.client.on("error", (err) => console.error("Redis Client Error:", err));
    this.client.on("connect", () => console.log("Connected to Redis"));
  }

  async get(key, recomputeCallback, ttl = 3600) {
    try {
      // Get the cached value and metadata
      const cached = await this.client.get(key);

      if (cached) {
        const { value, delta, expiry } = JSON.parse(cached);
        const now = Date.now();

        // Probabilistic early expiration check
        // Using the formula from the research paper
        const shouldRecompute =
          now - delta * this.beta * Math.log(Math.random()) >= expiry;

        console.log("shouldRecompute", shouldRecompute);

        if (!shouldRecompute) {
          return value;
        }
      }

      // If we need to recompute (cache miss or probabilistic expiration)
      const start = Date.now();
      const value = await recomputeCallback();
      const delta = Date.now() - start;
      const expiry = Date.now() + ttl * 1000;

      // Store value with metadata
      const cacheData = JSON.stringify({
        value,
        delta,
        expiry,
      });

      await this.client.set(key, cacheData, { EX: ttl });
      return value;
    } catch (error) {
      console.error("Redis operation error:", error);
      // On error, try to get fresh value
      return recomputeCallback();
    }
  }

  async invalidate(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error("Error invalidating cache:", error);
    }
  }
}

module.exports = RedisWrapper;
