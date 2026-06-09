import React, {
  useState
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

function EvidenceUpload() {

  const [file, setFile] =
    useState(null);

  const uploadFile =
    async () => {

      if (!file) {

        alert(
          "Select a file"
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(

          `${API_URL}/api/upload-evidence`,

          formData,

          {

            headers: {

              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "multipart/form-data"
            }
          }
        );

        alert(
          "Evidence uploaded successfully"
        );

      } catch (error) {

        console.error(error);

        alert(
          "Upload failed"
        );
      }
    };

  return (

    <div style={{ padding: "20px" }}>

      <h1>
        Evidence Upload
      </h1>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) =>
          setFile(
            e.target.files[0]
          )
        }
      />

      <br />
      <br />

      <button
        onClick={
          uploadFile
        }
      >
        Upload Evidence
      </button>

    </div>
  );
}

export default EvidenceUpload;