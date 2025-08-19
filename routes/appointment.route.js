import express from "express";
const router = express.Router();
router.post("/", (req, res) => {
  res.json("appointment route is working");
});
export default router;
