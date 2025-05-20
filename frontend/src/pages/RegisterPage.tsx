import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { axiosPublic } from "../config/api";
import { displayError } from "../utils/helpers";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const sendRegistrationRequest = async () => {
    await axiosPublic.post("/auth/register", formData).then(() => {
      navigate("/login")
    });
  };

  const {
    mutateAsync: registerUser,
    isPending,
    error
  } = useMutation({ mutationFn: sendRegistrationRequest });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await registerUser();
  };

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
        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            value={formData.confirmPassword}
            onChange={(event) =>
              setFormData({ ...formData, confirmPassword: event.target.value })
            }
          />
          <p className="text-sm text-gray-500">Passwords must match</p>
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
            {isPending ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
