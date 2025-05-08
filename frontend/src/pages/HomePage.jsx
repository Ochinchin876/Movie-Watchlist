import { useAuthStore } from "../store/authUser";

import HomeScreen from "./HomeScreen";
import LoginPage from "./LoginPage";

const HomePage = () => {
  const { user } = useAuthStore();

  return <>{user ? <HomeScreen /> : <LoginPage />}</>;
};
export default HomePage;
