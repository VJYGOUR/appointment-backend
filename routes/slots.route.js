import express from "express";
import getSlots from "../controllers/slots.controllers.js";
const router = express.Router();
router.get("/getSlots/:date", getSlots);
export default router;
