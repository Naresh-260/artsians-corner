// server.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config();

import app from "./src/app.js";
import mongoose from "mongoose";
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => console.log("Server running..."));
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    app.listen(process.env.PORT || 5000, () => console.log("Server running without MongoDB"));
  });