import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import PersistLogin from "./components/PersistLogin";
import PrivateRoute from "./components/PrivateRoute";
import TopBar from "./components/TopBar";
import { AuthProvider } from "./context/AuthProvider";
import { PopUpProvider } from "./context/PopUpProvider";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const queryClient = new QueryClient();

/**
 * The main app component, which wraps the entire app in providers for authentication
 * and react-query caching, and defines the routes.
 *
 * The app is organized into three main routes: the home page (at the root URL), the
 * login page (at /login), and the register page (at /register). The home page is
 * wrapped in the PersistLogin component, which ensures that the user is logged in
 * asuming they have a valid refresh token. The HomePage component is also wrapped
 * in the PrivateRoute component, which redirects the user to the login page if they
 * are not logged in. Finally, the home page is wrapped in the TopBar component,
 * which displays a logout button when logged in.
 */
function App() {
  return (
    <div className="app">
      <PopUpProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route element={<PersistLogin />}>
                  <Route element={<PrivateRoute />}>
                    <Route element={<TopBar />}>
                      <Route path="/" element={<HomePage />} />
                    </Route>
                  </Route>
                </Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </AuthProvider>
      </PopUpProvider>
    </div>
  );
}

export default App;
