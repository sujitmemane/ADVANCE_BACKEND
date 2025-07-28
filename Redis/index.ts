import express from "express";
import cusinesRoutes from "./routes/cuisines.ts";
import restaurantsRoutes from "./routes/restaurants.ts";
import { errorHandler } from "./middlewares/error-handler.ts";
import { connectDB } from "./utils/db.ts";
import initializeRedisClient from "./utils/redis-client.ts";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(errorHandler);

app.use("/cusines", cusinesRoutes);
app.use("/restaurants", restaurantsRoutes);

const initApp = async () => {
  try {
    await connectDB();
    await initializeRedisClient();
    app
      .listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
      })
      .on("error", (error) => {
        throw new Error(error?.message);
      });
  } catch (error) {}
};

initApp();
