import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp === "" || otp.length <= 0 || otp === null || otp === undefined) {
      alert("OTP is required");
      return;
    }

    // Call the API to verify the OTP
    const response = await axios.post(
      "http://localhost:8000/api/v1/auth/verify-email/",
      { otp }
    );

    if (!response.data) {
      alert("An error occurred. Please try again later.");
      return;
    }

    // const data = await response.data;
    navigate("/login");
  };

  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <fieldset className="form-group">
            <label htmlFor="otp">Enter your OTP Code:</label>
            <input
              type="text"
              className="email-form"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <input type="submit" value="Submit" className="submitButton" />
          </fieldset>
        </form>
      </div>
    </div>
  );
}
