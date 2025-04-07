const express = require("express");
const bodyParser = require("body-parser");

const { UserModel } = require("./models/user");
const { sequelize } = require("./db/index");
const RedisWrapper = require("./redis/client");

const app = express();
const redisClient = new RedisWrapper({
  beta: 1,
});

app.use(bodyParser.json());

app.post("/user", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.create({ email });

    await redisClient.invalidate(`user:${user.id}`);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await redisClient.get(
      `user:${id}`,
      async () => {
        const user = await UserModel.findByPk(id);
        return user;
      },
      3600 // TTL in seconds (1 hour)
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/user-db/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findByPk(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.send("OK");
});

const bootstrap = async () => {
  try {
    await sequelize.sync();
    console.log("Database is synced");
  } catch (error) {
    console.error("Error syncing database", error);
  }
};

bootstrap();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
