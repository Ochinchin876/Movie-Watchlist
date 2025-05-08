import express from "express";
import {
  getTvTrailers,
  getTvByCategory,
  getTvDetails,
  getSimilarTv,
  getTrendingTv,
} from "../controllers/tv.controller.js";

const router = express.Router();

router.get("/trending", getTrendingTv);
router.get("/:id/trailers", getTvTrailers);
router.get("/:id/details", getTvDetails);
router.get("/:id/similar", getSimilarTv);
router.get("/:category", getTvByCategory);

export default router;
