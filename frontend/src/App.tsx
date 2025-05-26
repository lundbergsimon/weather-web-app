import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import PersistLogin from "./components/PersistLogin";
import PrivateRoute from "./components/PrivateRoute";
import TopBar from "./components/TopBar";
import { AuthProvider } from "./context/AuthProvider";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="app">
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
    </div>
  );
}

export default App;
