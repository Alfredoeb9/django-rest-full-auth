/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import google from "google.accounts.id";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });

  const handleSignInWithGoogle = async (response: { credential: any }) => {
    google.accounts.id.prompt();
    const payload = response.credential;

    const server_res = await axios.post(
      "http://localhost:8000/api/v1/auth/google/",
      { access_token: payload }
    );

    if (!server_res.data) {
      alert("An error occurred. Please try again later.");
      return;
    }

    const data = await server_res.data;
    localStorage.setItem("access", JSON.stringify(data.access));
    localStorage.setItem("refresh", JSON.stringify(data.refresh));
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard");
    return data;
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_CLIENT_ID,
      callback: handleSignInWithGoogle,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "circle",
      width: "300px",
      height: "50px",
    });
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      alert("Passwords do not match");
      return;
    }

    if (formData.email === "") {
      alert("Email is required");
      return;
    }

    if (formData.first_name === "") {
      alert("First Name is required");
      return;
    }

    if (formData.last_name === "") {
      alert("Last Name is required");
      return;
    }

    if (formData.password === "") {
      alert("Password is required");
      return;
    }

    // Call the API to create the user
    const response = await axios.post(
      "http://localhost:8000/api/v1/auth/register/",
      formData
    );

    if (!response.data) {
      alert("An error occurred. Please try again later.");
      return;
    }

    const data = await response.data;
    navigate("/otp/verify", { state: { email: data.email } });
  };

  return (
    <div>
      <div className="form-container">
        <div className="wrapper">
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <fieldset className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="text"
                className="email-form"
                name="email"
                value={formData.email}
                onChange={handleOnChange}
              />

              <label htmlFor="first_name">First Name:</label>
              <input
                type="text"
                className="email-form"
                name="first_name"
                value={formData.first_name}
                onChange={handleOnChange}
              />

              <label htmlFor="last_name">Last Name:</label>
              <input
                type="text"
                className="email-form"
                name="last_name"
                value={formData.last_name}
                onChange={handleOnChange}
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="password-form"
                name="password"
                value={formData.password}
                onChange={handleOnChange}
              />

              <label htmlFor="password2">Confirm Password:</label>
              <input
                type="password"
                className="password-form"
                name="password2"
                value={formData.password2}
                onChange={handleOnChange}
              />

              <input type="submit" value="Submit" className="submitButton" />
            </fieldset>
          </form>

          <h3>or</h3>

          <div className="githubContainer">
            <button>Sign up with Github</button>
          </div>

          <div className="googleContainer" id="signInDiv">
            {/* <button>Sign up with Google</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
