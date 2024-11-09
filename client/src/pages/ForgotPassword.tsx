import { FormEvent, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Email is required");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/password-reset/", {
        email: email,
      });

      if (!response) {
        alert("Something went wrong");
        return;
      }

      alert("A password reset link has been sent to your email");
    } catch (error) {
      console.log(error);
    } finally {
      setEmail("");
    }
  };
  return (
    <div>
      <h1>Enter your Email Address</h1>

      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              className="email-form"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit">Send Email</button>
        </form>
      </div>
    </div>
  );
}
