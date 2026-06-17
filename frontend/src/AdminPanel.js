import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

/*
====================================
API URL
====================================
*/

const API_URL =
  "https://bauchi-election-dashboard-jjkdrh8lz.vercel.app";

/*
====================================
COMPONENT
====================================
*/

function AdminPanel() {

  /*
  ====================================
  STATES
  ====================================
  */

  const [users, setUsers] =
    useState([]);

  const [formData, setFormData] =
    useState({

      full_name: "",
      email: "",
      password: "",
      role: "observer"
    });

  /*
  ====================================
  TOKEN
  ====================================
  */

  const token =
    localStorage.getItem("token");

  /*
  ====================================
  FETCH USERS
  ====================================
  */

  const fetchUsers =
    useCallback(async () => {

      try {

        const response =
          await axios.get(

            `${API_URL}/api/users`,

            {
              headers: {
                authorization:
                  `Bearer ${token}`
              }
            }
          );

        setUsers(response.data);

      } catch (error) {

        console.error(
          "FETCH USERS ERROR:",
          error
        );
      }

    }, [token]);

  /*
  ====================================
  LOAD USERS
  ====================================
  */

  useEffect(() => {

    fetchUsers();

  }, [fetchUsers]);

  /*
  ====================================
  HANDLE INPUTS
  ====================================
  */

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value
      });
    };

  /*
  ====================================
  RESET FORM
  ====================================
  */

  const resetForm = () => {

    setFormData({

      full_name: "",
      email: "",
      password: "",
      role: "observer"
    });
  };

  /*
  ====================================
  CREATE USER
  ====================================
  */

  const createUser =
    async () => {

      try {

        const response =
          await axios.post(

            `${API_URL}/api/create-user`,

            formData,

            {
              headers: {
                authorization:
                  `Bearer ${token}`
              }
            }
          );

        console.log(response.data);

        alert(
          "User created successfully"
        );

        resetForm();

        fetchUsers();

      } catch (error) {

        console.error(
          error.response?.data
        );

        alert(

          error.response?.data?.message

          ||

          "Failed to create user"
        );
      }
    };

  /*
  ====================================
  DELETE USER
  ====================================
  */

  const deleteUser =
    async (id) => {

      try {

        await axios.delete(

          `${API_URL}/api/users/${id}`,

          {
            headers: {
              authorization:
                `Bearer ${token}`
            }
          }
        );

        alert("User deleted");

        fetchUsers();

      } catch (error) {

        console.error(error);

        alert(
          "Failed to delete user"
        );
      }
    };

  /*
  ====================================
  RENDER
  ====================================
  */

  return (

    <div style={containerStyle}>

      <h2>
        User Management
      </h2>

      {/* ================================ */}
      {/* CREATE USER FORM */}
      {/* ================================ */}

      <div style={cardStyle}>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          style={inputStyle}
          value={formData.full_name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          style={inputStyle}
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          style={inputStyle}
          value={formData.password}
          onChange={handleChange}
        />

        <select
          name="role"
          style={inputStyle}
          value={formData.role}
          onChange={handleChange}
        >

          <option value="observer">
            Observer
          </option>

          <option value="collation_officer">
            Collation Officer
          </option>

          <option value="admin">
            Admin
          </option>

        </select>

        <button
          style={buttonStyle}
          onClick={createUser}
        >

          Create User

        </button>

      </div>

      {/* ================================ */}
      {/* USERS TABLE */}
      {/* ================================ */}

      <div style={cardStyle}>

        <table style={tableStyle}>

          <thead>

            <tr>

              <th style={thStyle}>
                ID
              </th>

              <th style={thStyle}>
                Name
              </th>

              <th style={thStyle}>
                Email
              </th>

              <th style={thStyle}>
                Role
              </th>

              <th style={thStyle}>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {
              users.map((user) => (

                <tr key={user.id}>

                  <td style={tdStyle}>
                    {user.id}
                  </td>

                  <td style={tdStyle}>
                    {user.full_name}
                  </td>

                  <td style={tdStyle}>
                    {user.email}
                  </td>

                  <td style={tdStyle}>
                    {user.role}
                  </td>

                  <td style={tdStyle}>

                    {
                      user.role !==
                      "super_admin"

                      &&

                      <button

                        style={
                          deleteButtonStyle
                        }

                        onClick={() =>
                          deleteUser(user.id)
                        }
                      >

                        Delete

                      </button>
                    }

                  </td>

                </tr>
              ))
            }

          </tbody>

        </table>

      </div>

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

const cardStyle = {

  border: "1px solid #ccc",

  borderRadius: "10px",

  padding: "20px",

  marginBottom: "20px",

  backgroundColor: "#fff"
};

const inputStyle = {

  width: "100%",

  padding: "10px",

  marginBottom: "10px",

  borderRadius: "5px",

  border: "1px solid #ccc",

  boxSizing: "border-box"
};

const buttonStyle = {

  width: "100%",

  padding: "14px",

  backgroundColor: "green",

  color: "white",

  border: "none",

  borderRadius: "5px",

  cursor: "pointer"
};

const deleteButtonStyle = {

  padding: "8px 12px",

  backgroundColor: "red",

  color: "white",

  border: "none",

  borderRadius: "5px",

  cursor: "pointer"
};

const tableStyle = {

  width: "100%",

  borderCollapse: "collapse"
};

const thStyle = {

  border: "1px solid #ccc",

  padding: "10px",

  backgroundColor: "#f0f0f0"
};

const tdStyle = {

  border: "1px solid #ccc",

  padding: "10px",

  textAlign: "center"
};

export default AdminPanel;