import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

export const useWatchlistStore = create((set) => ({
  watchlist: [],
  fetchWatchlist: async () => {
    try {
      const res = await axios.get("/api/v1/watchlist");
      set({ watchlist: res.data.watchlist });
    } catch (error) {
      console.error("Failed to fetch watchlist", error);
    }
  },
  addToWatchlist: async (tmdbId, contentType) => {
    try {
      await axios.post("/api/v1/watchlist/add", { tmdbId, contentType });
      set((state) => ({
        watchlist: [
          ...state.watchlist,
          { tmdbId, contentType, status: "watching" },
        ],
      }));
      toast.success("Successfully added to Watchlist");
      // console.log(contentType);
    } catch (error) {
      console.error("Failed to add to watchlist", error.message);
    }
  },
  updateStatus: async (tmdbId, contentType, status) => {
    try {
      await axios.patch("/api/v1/watchlist/update", {
        tmdbId,
        contentType,
        status,
      });
      set((state) => ({
        watchlist: state.watchlist.map((item) =>
          item.tmdbId === tmdbId && item.contentType === contentType
            ? { ...item, status }
            : item
        ),
      }));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  },
  removeFromWatchlist: async (tmdbId, contentType) => {
    try {
      await axios.delete("/api/v1/watchlist/delete", {
        data: { tmdbId, contentType },
      });
      set((state) => ({
        watchlist: state.watchlist.filter(
          (item) =>
            !(item.tmdbId === tmdbId && item.contentType === contentType)
        ),
      }));
      toast.success("Successfully removed from Watchlist");
    } catch (error) {
      console.error("Failed to remove from watchlist", error);
    }
  },
}));
