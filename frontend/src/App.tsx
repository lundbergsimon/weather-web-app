import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
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
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<HomePage />} />
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
