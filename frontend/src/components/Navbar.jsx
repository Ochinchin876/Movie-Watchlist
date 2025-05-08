import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, Search } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const { setContentType } = useContentStore();

  return (
    <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
      <div className="flex items-center gap-10 z-50">
        <Link to="/">
          <img
            src="/newlogo.png"
            alt="chronoflix Logo"
            className="w-70 sm:w-80"
          />
        </Link>

        {/* desktop navbar items */}
        <div className="hidden sm:flex gap-2 items-center">
          <Link
            to="/"
            className="hover:bg-pink-500 transition-all duration-200 "
            onClick={() => setContentType("movie")}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="hover:bg-pink-500 transition-all duration-200"
            onClick={() => setContentType("tv")}
          >
            Anime
          </Link>
          <Link
            to="/watchlist"
            className="hover:bg-pink-500 transition-all duration-200"
          >
            Watchlist
          </Link>
        </div>
      </div>

      <div className="flex gap-2 items-center z-50">
        <Link to={"/search"}>
          <Search className="size-6 cursor-pointer" />
        </Link>
        <img
          src={user.image}
          alt="Avatar"
          className="h-8 rounded cursor-pointer"
        />
        <LogOut className="size-6 cursor-pointer" onClick={logout} />
        <div className="sm:hidden">
          <Menu className="size-6 cursor-pointer" onClick={toggleMobileMenu} />
        </div>
      </div>

      {/* mobile navbar items */}
      {isMobileMenuOpen && (
        <div className="w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800">
          <Link
            to="/"
            className="block hover:underline p-2"
            onClick={toggleMobileMenu}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="block hover:underline p-2"
            onClick={toggleMobileMenu}
          >
            Anime
          </Link>
          <Link
            to={"/watchlist"}
            className="block hover:underline p-2"
            onClick={toggleMobileMenu}
          >
            Watchlist
          </Link>
        </div>
      )}
    </header>
  );
};
export default Navbar;
