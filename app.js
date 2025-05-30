import express from "express";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/connectDB.js";
import notFound from "./src/middlewares/notFound.js";
import { errorMiddleware } from "./src/middlewares/error.js";

import authRoutesV1 from "./src/v1/routes/auth.routes.js";
import designerRoutesV1 from "./src/v1/routes/designer.routes.js";
import userRoutesV1 from "./src/v1/routes/user.routes.js";
import generalRoutesV1 from "./src/v1/routes/general.routes.js";
import paystackWebhookRoutes from "./src/v1/routes/paystack.webhook.routes.js";
import deliveryRoutes from "./src/v1/routes/delivery.routes.js";
import "./src/utils/cronJobs.js";

const app = express();
const port = process.env.PORT || 8080;

// Configure CORS options
const corsOptions = {
  origin: ["http://localhost:4000", "https://kunibi.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Apply CORS middleware with options
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutesV1);
app.use("/api/v1/designer", designerRoutesV1);
app.use("/api/v1/user", userRoutesV1);
app.use("/api/v1/general", generalRoutesV1);
// app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/paystack", paystackWebhookRoutes);
app.use("/api/v1/delivery", deliveryRoutes);
app.use(notFound);
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB(process.env.DB_URI);
    console.log(`DB Connected!`);
    app.listen(port, () => console.log(`Server is listening on PORT:${port}`));
  } catch (error) {
    console.log(`Couldn't connect because of ${error.message}`);
    process.exit(1);
  }
};

startServer();
