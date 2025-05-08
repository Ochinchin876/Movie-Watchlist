// routes/watchlist.js
import express from "express";
import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

const router = express.Router();

// Fetch the user's watchlist
router.get("/", async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("watchlist");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
    console.error("Error fetching watchlist", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/add", async (req, res) => {
  const { tmdbId, contentType } = req.body;
  const userId = req.user._id;
  console.log("Incoming watchlist body:", req.body);

  try {
    const user = await User.findById(userId);

    const exists = user.watchlist.some(
      (item) => item.tmdbId === tmdbId && item.contentType === contentType
    );

    if (exists) {
      return res.status(400).json({ message: "Item already in watchlist" });
    }
    // const apiContentType = contentType === "anime" ? "tv" : contentType;

    const tmdbUrl = `https://api.themoviedb.org/3/${contentType}/${tmdbId}`;
    console.log(tmdbUrl);
    const tmdbData = await fetchFromTMDB(tmdbUrl);

    const title = contentType === "movie" ? tmdbData.title : tmdbData.name;
    const posterPath = tmdbData.poster_path;
    console.log(title);
    console.log(posterPath);

    if (!title || !posterPath) {
      return res
        .status(400)
        .json({ message: "Could not fetch required data from TMDB" });
    }
    // const defocontentType = contentType === "movie" || "tv";

    user.watchlist.push({
      tmdbId,
      contentType,
      title,
      posterPath,
    });
    await user.save();

    res.status(200).json({ message: "Added to watchlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/update", async (req, res) => {
  const { tmdbId, contentType, status } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    const item = user.watchlist.find(
      (item) => item.tmdbId === tmdbId && item.contentType === contentType
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in watchlist" });
    }

    item.status = status;
    await user.save();

    res.status(200).json({ message: "Status updated" });
  } catch (error) {
    console.error("Error updating status", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete", async (req, res) => {
  const { tmdbId, contentType } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    user.watchlist = user.watchlist.filter(
      (item) => item.tmdbId !== tmdbId || item.contentType !== contentType
    );

    await user.save();

    res.status(200).json({ message: "Removed from watchlist" });
  } catch (error) {
    console.error("Error removing from watchlist", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
