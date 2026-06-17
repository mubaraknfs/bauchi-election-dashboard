import React, {
  useState
} from "react";

import axios from "axios";

import {
  useParams,
  useNavigate
} from "react-router-dom";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

function ResetPassword() {

  const { token } =
    useParams();

  const navigate =
    useNavigate();

  const [
    password,
    setPassword
  ] = useState("");

  const resetPassword =
    async () => {

      try {

        const response =
          await axios.post(

            `${API_URL}/api/reset-password`,

            {
              token,
              password
            }
          );

        alert(
          response.data.message
        );

        navigate("/");

      } catch (error) {

        alert(
          error.response?.data?.message
        );
      }
    };

  return (

    <div style={{
      padding: "40px"
    }}>

      <h1>
        Reset Password
      </h1>

      <input

        type="password"

        placeholder="New Password"

        value={password}

        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }

      />

      <br />
      <br />

      <button
        onClick={
          resetPassword
        }
      >
        Update Password
      </button>

    </div>
  );
}

export default ResetPassword;