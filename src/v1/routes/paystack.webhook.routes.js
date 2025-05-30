import express from "express";
import { handleWebhook } from "../controllers/paystack.webhook.controller.js";

const router = express.Router();

router.post("/webhook", handleWebhook);

export default router;
