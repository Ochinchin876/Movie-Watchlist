import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingTv(req, res) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/discover/tv?with_keywords=210024&sort_by=vote_count.desc"
    );
    const randomTv =
      data.results[Math.floor(Math.random() * data.results?.length)];
    // const randomAnime = data.results[0];
    res.json({ success: true, content: randomTv });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getTvTrailers(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`
    );

    res.json({ success: true, trailers: data.results });
  } catch (error) {
    if (error.message.includes("404")) {
      return res.status(404).send(null);
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getTvByCategory(req, res) {
  const { category } = req.params;
  let url = "";

  if (category === "popular") {
    url = `https://api.themoviedb.org/3/discover/tv?with_keywords=210024&sort_by=popularity.desc&page=1`;
  } else if (category === "top_rated") {
    url = `https://api.themoviedb.org/3/discover/tv?with_keywords=210024&sort_by=vote_count.desc&page=1`;
  } else if (category === "upcoming") {
    url = `https://api.themoviedb.org/3/discover/tv?with_keywords=210024&sort_by=popularity.desc&page=1&sort_by=first_air_date.desc`;
  } else if (category === "favorites") {
    url = `https://api.themoviedb.org/3/discover/tv?with_keywords=210024&sort_by=vote_average.desc`;
  }

  try {
    const data = await fetchFromTMDB(url);

    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSimilarTv(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`
    );
    res.status(200).json({ success: true, similar: data.results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getTvDetails(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}?language=en-US`
    );
    res.status(200).json({ success: true, content: data });
  } catch (error) {
    if (error.message.includes("404")) {
      return res.status(404).send(null);
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
