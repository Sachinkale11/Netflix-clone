import express from 'express';
import path from 'path';
import authRoutes from './routes/auth.route.js';
import tvRoutes from './routes/tv.route.js';
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import movieRoutes from './routes/movie.route.js';
import cookieParser from 'cookie-parser';
import { protectRoute } from './middlwares/protectRoute.js';
import searchRoutes from './routes/search.route.js';

const app = express();
const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();


app.use(express.json()); //allows us to parse JSON bodies(req.bddy)
app.use(cookieParser()); //allows us to parse cookies


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie",protectRoute, movieRoutes);
app.use("/api/v1/tv",protectRoute, tvRoutes);
app.use("/api/v1/search",protectRoute, searchRoutes);

if (ENV_VARS.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
	console.log("Server started at http://localhost:" + PORT);
	connectDB();
});