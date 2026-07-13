import express from "express";
import {
  getDropdowns,
  addDropdownValues,
  deleteDropdownValues,
  initializeDropdowns
} from "../controllers/dropdownController.mjs";

const router = express.Router();
router.post("/init", initializeDropdowns);
router.get("/", getDropdowns);
router.post("/", addDropdownValues);
router.delete("/", deleteDropdownValues);

export default router;