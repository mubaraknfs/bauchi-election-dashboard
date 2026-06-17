import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

function ResultImportCenter() {

  const [files, setFiles] =
    useState([]);

  useEffect(() => {

    loadFiles();

  }, []);

  const loadFiles =
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

        setFiles(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  return (

    <div style={pageStyle}>

      <h1>
        Result Import Center
      </h1>

      <p>
        Uploaded election evidence and imported documents.
      </p>

      <div style={summaryGrid}>

        <div style={cardStyle}>
          <h3>Total Files</h3>
          <h2>
            {files.length}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Latest Upload</h3>
          <p>
            {
              files.length > 0
                ? new Date(
                    files[0].upload_date
                  ).toLocaleString()
                : "No Uploads"
            }
          </p>
        </div>

      </div>

      <table
        style={tableStyle}
      >

        <thead>

          <tr>

            <th>ID</th>

            <th>Document</th>

            <th>User</th>

            <th>Role</th>

            <th>Date</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {

            files.map(
              (file) => (

                <tr
                  key={file.id}
                >

                  <td>
                    {file.id}
                  </td>

                  <td>
                    {
                      file.original_name
                    }
                  </td>

                  <td>
                    {
                      file.uploaded_by
                    }
                  </td>

                  <td>
                    {
                      file.uploaded_role
                    }
                  </td>

                  <td>

                    {

                      new Date(
                        file.upload_date
                      ).toLocaleString()

                    }

                  </td>

                  <td>

                    <a
                      href={
                        `${API_URL}/uploads/evidence/${file.filename}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>

                    {" | "}

                    <a
                      href={
                        `${API_URL}/uploads/evidence/${file.filename}`
                      }
                      download
                    >
                      Download
                    </a>

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

const pageStyle = {
  padding: "20px"
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(250px,1fr))",
  gap: "20px",
  marginBottom: "25px"
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

export default ResultImportCenter;