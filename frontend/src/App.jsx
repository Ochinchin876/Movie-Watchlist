import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/authUser";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import WatchPage from "./pages/WatchPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";
import { Loader } from "lucide-react";
import WatchList from "./pages/WatchListPage";

function App() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-red-600 size-10" />
        </div>
      </div>
    );
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route
          path="/signup"
          element={!user ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/watch/:id"
          element={user ? <WatchPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/search"
          element={user ? <SearchPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/watchlist"
          element={user ? <WatchList /> : <Navigate to={"/"} />}
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
