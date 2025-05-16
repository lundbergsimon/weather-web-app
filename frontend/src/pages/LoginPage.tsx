import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { axiosInstance } from "../config/api";
import { displayError } from "../utils/helpers";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }
    await loginUser();
  };

  const sendLoginRequest = async () => {
    await axiosInstance.post("/auth/login", formData).then(() => {
      navigate("/");
    });
  };

  const {
    mutateAsync: loginUser,
    isPending,
    error
  } = useMutation({ mutationFn: sendLoginRequest });

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 justify-center w-90"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={(event) =>
              setFormData({ ...formData, email: event.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={(event) =>
              setFormData({ ...formData, password: event.target.value })
            }
          />
        </div>
        {error && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-red-500">
              {displayError(error as Error)}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <button type="submit" className="mt-4">
            {isPending ? "Loading..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
