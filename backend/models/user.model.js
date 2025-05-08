import mongoose from "mongoose";

const watchlistItemSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true },
  contentType: {
    type: String,
    enum: ["movie", "tv"],
    required: true,
  },
  status: {
    type: String,
    enum: ["watching", "completed", "planned", "dropped", "on-Hold"],
    default: "watching",
  },
  title: { type: String },
  posterPath: { type: String },
});
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  searchHistory: {
    type: Array,
    default: [],
  },
  watchlist: {
    type: [watchlistItemSchema],
    default: [],
  },
});

export const User = mongoose.model("User", userSchema);
