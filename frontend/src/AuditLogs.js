import React, {

  useEffect,
  useState

} from "react";

import axios from "axios";

function AuditLogs() {

  /*
  ====================================
  STATES
  ====================================
  */

  const [

    logs,

    setLogs

  ] = useState([]);

  /*
  ====================================
  TOKEN
  ====================================
  */

  const token =
    localStorage.getItem(
      "token"
    );

  /*
  ====================================
  FETCH LOGS
  ====================================
  */

  const fetchLogs =
    async () => {

      try {

        const response =
          await axios.get(

            "http://localhost:5000/api/audit-logs",

            {

              headers: {

                authorization:
                  `Bearer ${token}`
              }
            }
          );

        setLogs(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  /*
  ====================================
  LOAD LOGS
  ====================================
  */

 useEffect(() => {

  fetchLogs();

}, [fetchLogs]);

  return (

    <div style={containerStyle}>

      <h2>
        Audit Logs
      </h2>

      <table style={tableStyle}>

        <thead>

          <tr>

            <th style={thStyle}>
              ID
            </th>

            <th style={thStyle}>
              User ID
            </th>

            <th style={thStyle}>
              Role
            </th>

            <th style={thStyle}>
              Action
            </th>

            <th style={thStyle}>
              Description
            </th>

            <th style={thStyle}>
              Time
            </th>

          </tr>

        </thead>

        <tbody>

          {
            logs.map((log) => (

              <tr key={log.id}>

                <td style={tdStyle}>
                  {log.id}
                </td>

                <td style={tdStyle}>
                  {log.user_id}
                </td>

                <td style={tdStyle}>
                  {log.user_role}
                </td>

                <td style={tdStyle}>
                  {log.action_type}
                </td>

                <td style={tdStyle}>
                  {log.action_description}
                </td>

                <td style={tdStyle}>

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

/*
====================================
STYLES
====================================
*/

const containerStyle = {

  marginTop: "30px"
};

const tableStyle = {

  width: "100%",

  borderCollapse: "collapse",

  backgroundColor: "#fff"
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

export default AuditLogs;