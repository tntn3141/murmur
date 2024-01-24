import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { ChatContextProvider } from "./context/ChatContext.tsx";
import { ThemeContextProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <ChatContextProvider>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
