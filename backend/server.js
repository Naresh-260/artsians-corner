// server.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config(); // runs synchronously before anything else

import app from "./src/app.js";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => console.log("Server running..."));
  })
  .catch(err => console.log(err));