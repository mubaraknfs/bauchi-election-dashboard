import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard-jjkdrh8lz.vercel.app";

function UserManagement() {

  const token =
    localStorage.getItem("token");

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [formData, setFormData] =
    useState({

      full_name: "",

      email: "",

      phone_number: "",

      password: "",

      role: "observer"
    });

  /*
  ====================================
  FETCH USERS
  ====================================
  */

  const fetchUsers =
    useCallback(async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(

            `${API_URL}/api/users`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setUsers(response.data);

        setError("");

      } catch (err) {

        console.error(err);

        setError(
          "Failed to load users"
        );

      } finally {

        setLoading(false);
      }

    }, [token]);

  useEffect(() => {

    fetchUsers();

  }, [fetchUsers]);

  /*
  ====================================
  INPUT HANDLER
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
  CREATE USER
  ====================================
  */

  const createUser =
    async () => {

      try {

        if (

          !formData.full_name ||

          !formData.email ||

          !formData.phone_number ||

          !formData.password

        ) {

          alert(
            "All fields are required"
          );

          return;
        }

        await axios.post(

  `${API_URL}/api/create-user`,

  formData,

  {

    headers: {

      Authorization:
        `Bearer ${token}`
    }
  }
);

        alert(
          "User created successfully"
        );

        setFormData({

          full_name: "",

          email: "",

          phone_number: "",

          password: "",

          role: "observer"
        });

        fetchUsers();

      } catch (error) {

        console.error(error);

        alert(
          error.response?.data?.message ||
          "Failed to create user"
        );
      }
    };

  /*
====================================
TOGGLE USER STATUS
====================================
*/

const toggleUserStatus =
  async (id) => {

    try {

      await axios.put(

        `${API_URL}/api/users/${id}/status`,

        {},

        {

          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      );

      fetchUsers();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to update status"
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

      const confirmDelete =
        window.confirm(
          "Delete this user?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(

          `${API_URL}/api/users/${id}`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`
            }
          }
        );

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
  FILTER USERS
  ====================================
  */

  const filteredUsers =
    users.filter((user) =>

      user.full_name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      user.email
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  /*
  ====================================
  DASHBOARD STATS
  ====================================
  */

  const totalUsers =
    users.length;

  const observers =
    users.filter(
      (u) =>
        u.role === "observer"
    ).length;

  const admins =
    users.filter(
      (u) =>
        u.role === "admin"
    ).length;

  const collation =
    users.filter(
      (u) =>
        u.role ===
        "collation_officer"
    ).length;

  if (loading) {

    return (
      <div style={{ padding: 20 }}>
        <h2>
          Loading Users...
        </h2>
      </div>
    );
  }

  if (error) {

    return (
      <div
        style={{
          padding: 20,
          color: "red"
        }}
      >
        <h2>{error}</h2>
      </div>
    );
  }

  return (

    <div style={{ padding: 20 }}>

      <h1>
        User Management
      </h1>

      {/* STATS */}

      <div style={statsContainer}>

        <div style={cardStyle}>
          <h4>Total Users</h4>
          <h2>{totalUsers}</h2>
        </div>

        <div style={cardStyle}>
          <h4>Observers</h4>
          <h2>{observers}</h2>
        </div>

        <div style={cardStyle}>
          <h4>Admins</h4>
          <h2>{admins}</h2>
        </div>

        <div style={cardStyle}>
          <h4>Collation</h4>
          <h2>{collation}</h2>
        </div>

      </div>

      {/* CREATE USER */}

      <div style={formCard}>

        <h3>
          Create User
        </h3>

        <input
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="observer">
            Observer
          </option>

          <option value="admin">
            Admin
          </option>

          <option value="collation_officer">
            Collation Officer
          </option>
        </select>

        <button
          style={createButton}
          onClick={createUser}
        >
          Create User
        </button>

      </div>

      {/* SEARCH */}

      <input
        placeholder="Search users..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={{
          ...inputStyle,
          marginTop: 20,
          maxWidth: 300
        }}
      />

      {/* USERS TABLE */}

      <table style={tableStyle}>

        <thead>

          <tr>

            <th style={thStyle}>ID</th>

            <th style={thStyle}>Full Name</th>

            <th style={thStyle}>Email</th>

            <th style={thStyle}>Phone</th>

           <th style={thStyle}>Role</th>

           <th style={thStyle}>Status</th>

           <th style={thStyle}>Action</th>

          </tr>

        </thead>

        <tbody>

          {filteredUsers.map(
            (user) => (

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
                  {user.phone_number}
                </td>

                <td style={tdStyle}>
                {user.role}
               </td>

              <td style={tdStyle}>

               {user.is_active ? (

    <span
      style={{
        color: "green",
        fontWeight: "bold"
      }}
    >
      Active
    </span>

  ) : (

    <span
      style={{
        color: "red",
        fontWeight: "bold"
      }}
    >
      Disabled
    </span>

  )}

</td>

<td style={tdStyle}>
<div
  style={{
    display: "flex",
    gap: "5px"
  }}
>

  <button

    style={

      user.is_active

        ? disableButton

        : enableButton
    }

    onClick={() =>
      toggleUserStatus(
        user.id
      )
    }
  >

    {user.is_active

      ? "Disable"

      : "Enable"}

  </button>

  <button

    style={deleteButton}

    onClick={() =>
      deleteUser(user.id)
    }
  >
    Delete
  </button>

</div>

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}

const statsContainer = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(200px,1fr))",

  gap: "15px",

  marginBottom: "20px"
};

const cardStyle = {

  border: "1px solid #ddd",

  borderRadius: "10px",

  padding: "20px",

  background: "#fff",

  textAlign: "center"
};

const formCard = {

  border: "1px solid #ddd",

  borderRadius: "10px",

  padding: "20px",

  background: "#fff",

  marginBottom: "20px"
};

const inputStyle = {

  width: "100%",

  padding: "10px",

  marginBottom: "10px",

  border: "1px solid #ccc",

  borderRadius: "5px"
};

const createButton = {

  background: "#2563eb",

  color: "#fff",

  border: "none",

  padding: "10px 20px",

  borderRadius: "5px",

  cursor: "pointer"
};

const deleteButton = {

  background: "#dc2626",

  color: "#fff",

  border: "none",

  padding: "6px 12px",

  borderRadius: "5px",

  cursor: "pointer"
};

 const enableButton = {

  background: "#16a34a",

  color: "#fff",

  border: "none",

  padding: "6px 12px",

  borderRadius: "5px",

  cursor: "pointer"
};

const disableButton = {

  background: "#f59e0b",

  color: "#fff",

  border: "none",

  padding: "6px 12px",

  borderRadius: "5px",

  cursor: "pointer"
};

const tableStyle = {

  width: "100%",

  borderCollapse: "collapse",

  marginTop: "20px"
};

const thStyle = {

  border: "1px solid #ddd",

  padding: "12px",

  background: "#0f172a",

  color: "#fff"
};

const tdStyle = {

  border: "1px solid #ddd",

  padding: "10px"
};

export default UserManagement;