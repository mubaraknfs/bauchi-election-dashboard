import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";
import { io } from "socket.io-client";

/*
|--------------------------------------------------------------------------
| SOCKET CONNECTION
|--------------------------------------------------------------------------
*/

const socket = io(
  "https://bauchi-election-dashboard.onrender.com"
);

function ApprovalPanel() {

  /*
  |--------------------------------------------------------------------------
  | STATES
  |--------------------------------------------------------------------------
  */

  const [
    pendingResults,
    setPendingResults
  ] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | TOKEN
  |--------------------------------------------------------------------------
  */

  const token = localStorage.getItem(
    "token"
  );

  /*
  |--------------------------------------------------------------------------
  | FETCH PENDING RESULTS
  |--------------------------------------------------------------------------
  */

  const fetchPendingResults = useCallback(
    async () => {

      try {

        const response =
          await axios.get(
            "https://bauchi-election-dashboard.onrender.com/api/pending-results",
            {
              headers: {
                authorization:
                  `Bearer ${token}`
              }
            }
          );

        console.log(
          "Pending Results:",
          response.data
        );

        setPendingResults(
          response.data
        );

      } catch (error) {

        console.error(
          "Pending Results Error:",
          error.response?.data ||
          error.message
        );
      }
    },
    [token]
  );

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    fetchPendingResults();

  }, [fetchPendingResults]);

  /*
  |--------------------------------------------------------------------------
  | REALTIME LISTENER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    socket.on(
      "new_result",
      fetchPendingResults
    );

    return () => {

      socket.off(
        "new_result",
        fetchPendingResults
      );
    };

  }, [fetchPendingResults]);

  /*
  |--------------------------------------------------------------------------
  | APPROVE RESULT
  |--------------------------------------------------------------------------
  */

  const approveResult = async (id) => {

    try {

      await axios.put(

        `https://bauchi-election-dashboard.onrender.com/api/approve-result/${id}`,

        {},

        {
          headers: {
            authorization:
              `Bearer ${token}`
          }
        }
      );

      alert(
        "Result approved"
      );

      fetchPendingResults();

    } catch (error) {

      console.error(error);

      alert(
        "Approval failed"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REJECT RESULT
  |--------------------------------------------------------------------------
  */

  const rejectResult = async (id) => {

    try {

      await axios.put(

        `https://bauchi-election-dashboard.onrender.com/api/reject-result/${id}`,

        {},

        {
          headers: {
            authorization:
              `Bearer ${token}`
          }
        }
      );

      alert(
        "Result rejected"
      );

      fetchPendingResults();

    } catch (error) {

      console.error(error);

      alert(
        "Rejection failed"
      );
    }
  };

  return (

    <div style={containerStyle}>

      <h2>
        Pending Result Approvals
      </h2>

      {
        pendingResults.length === 0 && (

          <p>
            No pending results found.
          </p>
        )
      }

      <table style={tableStyle}>

        <thead>

          <tr>

            <th style={thStyle}>
              ID
            </th>

            <th style={thStyle}>
              Ward
            </th>

            <th style={thStyle}>
              Polling Unit
            </th>

            <th style={thStyle}>
              Party Agent
            </th>

            <th style={thStyle}>
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {
            pendingResults.map(
              (result) => (

                <tr
                  key={result.id}
                >

                  <td style={tdStyle}>
                    {result.id}
                  </td>

                  <td style={tdStyle}>
                    {result.ward}
                  </td>

                  <td style={tdStyle}>
                    {result.polling_unit}
                  </td>

                  <td style={tdStyle}>
                    {result.party_agent}
                  </td>

                  <td style={tdStyle}>

                    <button

                      style={
                        approveButtonStyle
                      }

                      onClick={() =>
                        approveResult(
                          result.id
                        )
                      }
                    >

                      Approve

                    </button>

                    <button

                      style={
                        rejectButtonStyle
                      }

                      onClick={() =>
                        rejectResult(
                          result.id
                        )
                      }
                    >

                      Reject

                    </button>

                  </td>

                </tr>
              )
            )
          }

        </tbody>

      </table>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const containerStyle = {
  marginTop: "30px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#ffffff"
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "12px",
  backgroundColor: "#f0f0f0"
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "12px",
  textAlign: "center"
};

const approveButtonStyle = {
  padding: "8px 12px",
  marginRight: "10px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const rejectButtonStyle = {
  padding: "8px 12px",
  backgroundColor: "red",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default ApprovalPanel;