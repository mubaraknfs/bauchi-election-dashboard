import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard-jjkdrh8lz.vercel.app";

function ImportHistory() {

  const [history, setHistory] =
    useState([]);

  useEffect(() => {

    loadHistory();

  }, []);

  const loadHistory =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
  await axios.get(

    `${API_URL}/api/import-history`,

    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

console.log(
  "IMPORT HISTORY RESPONSE:",
  response.data
);

setHistory(
  response.data
);

      } catch (error) {

        console.error(error);
      }
    };

  return (

    <div style={{ padding: "20px" }}>

      <h1>
        Import History
      </h1>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse:
            "collapse"
        }}
      >

        <thead>

          <tr>

            <th>ID</th>

            <th>File Name</th>

            <th>Original Name</th>

            <th>User ID</th>

            <th>Role</th>

            <th>Date</th>

          </tr>

        </thead>

        <tbody>

          {

            history.map(
              (item) => (

                <tr
                  key={item.id}
                >

                  <td>
                    {item.id}
                  </td>

                  <td>
                    {
                      item.filename
                    }
                  </td>

                  <td>
                    {
                      item.original_name
                    }
                  </td>

                  <td>
                    {
                      item.uploaded_by
                    }
                  </td>

                  <td>
                    {
                      item.uploaded_role
                    }
                  </td>

                  <td>

                    {

                      new Date(
                        item.upload_date
                      ).toLocaleString()

                    }

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

export default ImportHistory;