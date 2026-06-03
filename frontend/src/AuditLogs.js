import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function AuditLogs() {

  const [logs, setLogs] =
    useState([]);

  const fetchLogs =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(

            "https://bauchi-election-dashboard.onrender.com/api/audit-logs",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        console.log(
          "AUDIT LOGS:",
          response.data
        );

        setLogs(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  useEffect(() => {

    fetchLogs();

  }, []);

  return (

    <div style={cardStyle}>

      <h2>
        Audit Logs
      </h2>

      <table style={tableStyle}>

        <thead>

          <tr>

            <th>ID</th>

            <th>User ID</th>

            <th>Role</th>

            <th>Action</th>

            <th>Description</th>

            <th>Time</th>

          </tr>

        </thead>

        <tbody>

          {

            logs.map((log) => (

              <tr key={log.id}>

                <td>{log.id}</td>

                <td>{log.user_id}</td>

                <td>{log.user_role}</td>

                <td>{log.action_type}</td>

                <td>{log.action_description}</td>

                <td>

                  {

                    new Date(
                      log.created_at
                    ).toLocaleString()
                  }

                </td>

              </tr>
            ))
          }

        </tbody>

      </table>

    </div>
  );
}

const cardStyle = {

  border: "1px solid #ccc",

  borderRadius: "10px",

  padding: "20px",

  marginBottom: "20px",

  backgroundColor: "#fff"
};

const tableStyle = {

  width: "100%",

  borderCollapse: "collapse"
};

export default AuditLogs;