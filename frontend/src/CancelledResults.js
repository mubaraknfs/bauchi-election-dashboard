import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

function CancelledResults() {

  const [results, setResults] =
    useState([]);

  useEffect(() => {

    fetchResults();

  }, []);

  const fetchResults =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(

            `${API_URL}/api/cancelled-results`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setResults(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  return (

    <div style={{ padding: 20 }}>

      <h1>
        Cancelled Elections
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse:
            "collapse"
        }}
      >

        <thead>

          <tr>

            <th>Ward</th>

            <th>
              Polling Unit
            </th>

            <th>
              Reason
            </th>

            <th>
              Comment
            </th>

            <th>
              Party Agent
            </th>

            <th>
              Phone
            </th>

          </tr>

        </thead>

        <tbody>

          {results.map(
            (row) => (

              <tr
                key={row.id}
              >

                <td>
                  {row.ward}
                </td>

                <td>
                  {row.polling_unit}
                </td>

                <td>
                  {
                    row.cancellation_reason
                  }
                </td>

                <td>
                  {
                    row.cancellation_comment
                  }
                </td>

                <td>
                  {
                    row.party_agent
                  }
                </td>

                <td>
                  {
                    row.phone_number
                  }
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}

export default CancelledResults;