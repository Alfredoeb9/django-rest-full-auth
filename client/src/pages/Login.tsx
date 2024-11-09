import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(loginData);

    // Add the logic to send the data to the server
    const response = await axios.post(
      "http://localhost:8000/api/v1/auth/login/",
      loginData
    );

    if (!response) {
      console.log("Error");
      return;
    }

    const data = await response.data;

    const user = {
      email: data.email,
      name: data.full_name,
    };

    // save user data to local storage or state management like redux or context api
    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("access", JSON.stringify(data.access_token));
    localStorage.setItem("refresh", JSON.stringify(data.refresh_token));

    setLoginData({
      email: "",
      password: "",
    });

    navigate("/dashboard");
    return data;
  };

  return (
    <div>
      <div className="form-container">
        <div className="wrapper">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <fieldset className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="text"
                className="email-form"
                name="email"
                value={loginData.email}
                onChange={handleChange}
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="password-form"
                name="password"
                value={loginData.password}
                onChange={handleChange}
              />

              <input type="submit" value="Submit" className="submitButton" />
              <p className="pass-link">
                <Link to={"/forgot-password"}>Forgot Password</Link>
              </p>
            </fieldset>
          </form>

          <h3>or</h3>

          <div className="githubContainer">
            <button>Login in with Github</button>
          </div>

          <div className="googleContainer">
            <button>Login in with Google</button>
          </div>
        </div>
      </div>
    </div>
  );
}
