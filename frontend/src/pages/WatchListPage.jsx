import { useState, useRef, useEffect } from "react";
import { useWatchlistStore } from "../store/watchlistStore";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useContentStore } from "../store/content";
import Footer from "../components/Footer";

const WatchList = () => {
  const { watchlist, fetchWatchlist } = useWatchlistStore();
  const [option, setOption] = useState("All");
  const SelectRef = useRef(null);

  useEffect(() => {
    fetchWatchlist(); // Make sure watchlist is loaded
  }, [fetchWatchlist]);

  const onOptionChangeHandler = async (event) => {
    SelectRef.current.disabled = true;
    const val = event.target.value;
    SelectRef.current.disabled = false;
    setOption(val);
  };

  const handleClick = (e) => {
    const target = e.target;
    if (target.classList.contains("tab")) {
      const items = target.parentElement.children;
      for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("tab-active");
      }
      target.classList.add("tab-active");
      setOption(target.textContent);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div
        role="tablist"
        className="tabs tabs-lift px-20 py-10 justify-center font-bold text-white"
        onClick={handleClick}
      >
        <a role="tab" className="tab tab-active [--tab-bg:crimson]">
          All
        </a>
        <a role="tab" className="tab [--tab-bg:crimson]">
          Watching
        </a>
        <a role="tab" className="tab [--tab-bg:crimson]">
          Completed
        </a>
        <a role="tab" className="tab [--tab-bg:crimson]">
          Planned
        </a>
        <a role="tab" className="tab [--tab-bg:crimson]">
          Dropped
        </a>
        <a role="tab" className="tab [--tab-bg:crimson]">
          On-Hold
        </a>
      </div>

      <select
        value={option}
        ref={SelectRef}
        className="m-4 select select-primary w-1/2 sm:hidden"
        onChange={onOptionChangeHandler}
      >
        <option value="all">All</option>
        <option value="watching">Watching</option>
        <option value="completed">Completed</option>
        <option value="dropped">Dropped</option>
        <option value="planned">Planned</option>
        <option value="on-hold">On-Hold</option>
      </select>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-20">
        {watchlist
          .filter((item) => {
            if (option.toLowerCase() === "all") return true;
            return item.status?.toLowerCase() === option.toLowerCase();
          })
          .map((item) => (
            <Link
              key={item.tmdbId}
              to={`/watch/${item.tmdbId}-${item.contentType}`}
              onClick={() =>
                useContentStore.getState().setContentType(item.contentType)
              }
              className="p-4 rounded group transition-transform duration-300 hover:scale-105"
            >
              <div className="relative flex flex-col items-center">
                <img
                  src={ORIGINAL_IMG_BASE_URL + item.posterPath}
                  alt={item.title || item.name}
                  className="w-full h-auto rounded hover:shadow-lg"
                />
                <div className="top-0 right-0 absolute text-xs px-2 py-1 rounded bg-orange-600 text-white shadow-md">
                  {/* if wanna  show status on hover, keep  group-hover:opacity-100 transition after and rempove it for status showing all time */}
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              </div>
              <h2 className="mt-2 text-xl font-bold text-center">
                {item.title || item.name}
              </h2>
            </Link>
          ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full text-white text-center">
        <Footer />
      </div>
    </div>
  );
};

export default WatchList;
