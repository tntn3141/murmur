import "./App.css";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { useContext } from "react";
import { ChatContext } from "./context/ChatContext";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";

axios.defaults.baseURL = "https://murmur-chat.fly.dev";
axios.defaults.withCredentials = true;

function App() {
  const { combinedNotifications } = useContext(ChatContext);
  const notificationCount = combinedNotifications.length;
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {notificationCount && (
          <title>{`(${notificationCount}) Murmur`}</title>
        )}
        {!notificationCount && (
          <title>Murmur</title>
        )}
        <link rel="icon" type="image/svg+xml" href="./assets/favicon.ico" />
      </Helmet>
      <NavBar />
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
