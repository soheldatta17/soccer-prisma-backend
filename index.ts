import express from 'express';
import cors from 'cors';
import { roleRoutes } from "./src/routes/roleRoute";
import { authRoutes } from "./src/routes/authRoute";
import { teamRoutes } from "./src/routes/teamRoute";
import { playerRoutes } from "./src/routes/playerRoute";
import { convertToWebRequest } from "./src/utils/request";

const app = express();
const port = 3000;

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*',
  credentials: true
}));

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.path}`);
  next();
});

// Routes
app.use('/v1/role', async (req, res) => {
  const webRequest = convertToWebRequest(req);
  const response = await roleRoutes(webRequest);
  res.status(response.status).json(JSON.parse(await response.text()));
});

app.use('/v1/auth', async (req, res) => {
  const webRequest = convertToWebRequest(req);
  const response = await authRoutes(webRequest);
  res.status(response.status).json(JSON.parse(await response.text()));
});

app.use('/v1/team', async (req, res) => {
  const webRequest = convertToWebRequest(req);
  const response = await teamRoutes(webRequest);
  res.status(response.status).json(JSON.parse(await response.text()));
});

app.use('/v1/player', async (req, res) => {
  const webRequest = convertToWebRequest(req);
  const response = await playerRoutes(webRequest);
  res.status(response.status).json(JSON.parse(await response.text()));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: false, message: "Route Not Found" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
