import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import ReactPlayer from "react-player";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeletons";
import { useWatchlistStore } from "../store/watchlistStore";
import Footer from "../components/Footer";

const WatchPage = () => {
  const { id } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useContentStore();
  const {
    watchlist,
    fetchWatchlist,
    addToWatchlist,
    updateStatus,
    removeFromWatchlist,
  } = useWatchlistStore();
  const sliderRef = useRef(null);

  const isInWatchlist = watchlist.some(
    (item) => item.tmdbId === parseInt(id) && item.contentType === contentType
  );

  const currentStatus = isInWatchlist
    ? watchlist.find(
        (item) =>
          item.tmdbId === parseInt(id) && item.contentType === contentType
      ).status
    : null;

  const handleAdd = () => {
    addToWatchlist(parseInt(id), contentType);
  };

  const handleStatusChange = (e) => {
    updateStatus(parseInt(id), contentType, e.target.value);
  };

  const handleRemove = () => {
    removeFromWatchlist(parseInt(id), contentType);
  };
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
        console.log(res.data.trailers);
        setTrailers(res.data.trailers);
      } catch (error) {
        if (error.message.includes("404")) {
          setTrailers([]);
        }
      }
    };

    getTrailers();
  }, [contentType, id]);

  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
        setSimilarContent(res.data.similar);
      } catch (error) {
        if (error.message.includes("404")) {
          setSimilarContent([]);
        }
      }
    };

    getSimilarContent();
  }, [contentType, id]);

  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
        setContent(res.data.content);
        console.log(res.data.content);
      } catch (error) {
        if (error.message.includes("404")) {
          setContent(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getContentDetails();
  }, [contentType, id]);

  const scrollLeft = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };
  const scrollRight = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );

  if (!content) {
    return (
      <div className="bg-black text-white h-screen">
        <div className="max-w-6xl mx-auto">
          <Navbar />
          <div className="text-center mx-auto px-4 py-8 h-full mt-40">
            <h2 className="text-2xl sm:text-5xl font-bold text-balance">
              Content not found
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container px-4 py-8 h-full">
        <Navbar />

        <div className="aspect-video mb-6 mt-8 p-2 sm:px-10 md:px-32">
          {trailers?.length > 0 && (
            <ReactPlayer
              controls={true}
              width={"100%"}
              height={"70vh"}
              className="mx-auto overflow-hidden rounded-lg"
              url={`https://www.youtube.com/watch?v=${trailers[0].key}`}
            />
          )}

          {trailers?.length === 0 && (
            <h2 className="text-xl text-center mt-">
              No trailers available for{" "}
              <span className="font-bold text-pink-600">
                {content?.title || content?.name}
              </span>{" "}
            </h2>
          )}
        </div>

        {/* movie details */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-20
                max-w-6xl mx-auto"
        >
          <div className="mb-4 md:mb-0">
            <h2 className="text-5xl font-bold text-balance">
              {content?.title || content?.name}
            </h2>

            <p className="mt-2 text-lg">
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{" "}
              |{" "}
              {content?.adult ? (
                <span className="text-red-600">18+</span>
              ) : (
                <span className="text-green-600">PG-13</span>
              )}{" "}
            </p>
            <p className="mt-4 text-lg">{content?.overview}</p>
          </div>
          {/* <div className="mt-4 flex flex-wrap gap-2">
            {content?.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div> */}
          <img
            src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
            alt="Poster image"
            className="max-h-[600px] rounded-md "
          />
        </div>

        {/* Watchlist actions */}
        <div className="mb-8 flex justify-center mt-6">
          {!isInWatchlist ? (
            <button
              className="px-4 py-2 border border-pink-600 rounded-lg cursor-pointer transition-all duration-300 bg-pink-600 text-white hover:bg-pink-800 w-full sm:w-auto"
              onClick={handleAdd}
            >
              Add to Watchlist
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <select
                className="px-3 py-2 border border-pink-600 bg-pink-600 text-white rounded-lg cursor-pointer"
                value={currentStatus}
                onChange={handleStatusChange}
              >
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
                <option value="planned">Planned</option>
                <option value="dropped">Dropped</option>
                <option value="on-Hold">On-Hold</option>
              </select>

              <Trash
                className="size-5 cursor-pointer hover:text-pink-600"
                onClick={handleRemove}
              />
            </div>
          )}
        </div>

        {similarContent.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto relative">
            <h3 className="text-3xl font-bold mb-4">Similar Movies/Tv Show</h3>

            <div
              className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group"
              ref={sliderRef}
            >
              {similarContent.map((content) => {
                if (content.poster_path === null) return null; //for no posters just exclude them from similar
                return (
                  <Link
                    key={content.id}
                    to={`/watch/${content.id}`}
                    className="w-52 flex-none"
                  >
                    <img
                      src={SMALL_IMG_BASE_URL + content.poster_path}
                      alt="Poster path"
                      className="w-full h-auto rounded-md hover:rotate-2"
                    />
                    <h4 className="mt-2 text-lg font-semibold">
                      {content.title || content.name}
                    </h4>
                  </Link>
                );
              })}

              <ChevronRight
                className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8
                                        opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
                                         bg-pink-600 text-white rounded-full"
                onClick={scrollRight}
              />
              <ChevronLeft
                className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0
                                group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-pink-600
                                text-white rounded-full"
                onClick={scrollLeft}
              />
            </div>
          </div>
        )}
      </div>
      <div className=" bottom-0 left-0 w-full text-white text-center ">
        <Footer />
      </div>
    </div>
  );
};
export default WatchPage;
