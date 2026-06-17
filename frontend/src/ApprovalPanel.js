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
  "https://bauchi-election-dashboard-jjkdrh8lz.vercel.app"
);

const API_URL =
  "https://bauchi-election-dashboard-jjkdrh8lz.vercel.app";

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

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    search,
    setSearch
  ] = useState("");

  const [
  targetSelections,
  setTargetSelections
] = useState({});

  /*
  |--------------------------------------------------------------------------
  | TOKEN
  |--------------------------------------------------------------------------
  */

  const token =
    localStorage.getItem(
      "token"
    );

  /*
  |--------------------------------------------------------------------------
  | FETCH PENDING RESULTS
  |--------------------------------------------------------------------------
  */

  const fetchPendingResults =
    useCallback(async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(

            `${API_URL}/api/pending-results`,

            {
              headers: {
                authorization:
                  `Bearer ${token}`
              }
            }
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

      } finally {

        setLoading(false);
      }

    }, [token]);

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

 const approveResult =
  async (
    id,
    target
  ) => {

      const confirmed =
        window.confirm(
          "Approve this result?"
        );

      if (!confirmed)
        return;

      try {

        await axios.put(

  `${API_URL}/api/approve-result/${id}`,

  {
    target
  },

  {
            headers: {
              authorization:
                `Bearer ${token}`
            }
          }
        );

        alert(
          "Result approved successfully"
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

  const rejectResult =
    async (id) => {

      const confirmed =
        window.confirm(
          "Reject this result?"
        );

      if (!confirmed)
        return;

      try {

        await axios.put(

          `${API_URL}/api/reject-result/${id}`,

          {},

          {
            headers: {
              authorization:
                `Bearer ${token}`
            }
          }
        );

        alert(
          "Result rejected successfully"
        );

        fetchPendingResults();

      } catch (error) {

        console.error(error);

        alert(
          "Rejection failed"
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | FILTER RESULTS
  |--------------------------------------------------------------------------
  */

  const filteredResults =
    pendingResults.filter(
      (result) =>

        result.ward
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        result.polling_unit
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        result.party_agent
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        result.phone_number
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div style={pageStyle}>

        <h2>
          Loading pending results...
        </h2>

      </div>
    );
  }

  return (

    <div style={pageStyle}>

      <h1 style={titleStyle}>
        Pending Result Approvals
      </h1>

      {/* SUMMARY */}

      <div style={summaryGrid}>

        <div style={summaryCard}>

          <h4>
            Pending Results
          </h4>

          <h1>
            {pendingResults.length}
          </h1>

        </div>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search ward, polling unit, party agent..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={searchStyle}
      />

      {/* TABLE */}

      <div style={tableContainer}>

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
                Phone Number
              </th>

              <th style={thStyle}>
               Status
                </th>

              <th style={thStyle}>
               Target
                </th>

              <th style={thStyle}>
               Action
              </th>

            </tr>

          </thead>

          <tbody>

            {

              filteredResults.length === 0

                ?

                (

                  <tr>

                    <td
                      colSpan="8"
                    style={emptyStyle}
                   >

                      No pending results found

                    </td>

                  </tr>

                )

                :

                filteredResults.map(
                  (
                    result,
                    index
                  ) => (

                    <tr

                      key={result.id}

                      style={{

                        backgroundColor:

                          index % 2 === 0

                            ? "#ffffff"

                            : "#f8fafc"
                      }}
                    >

                      <td style={tdStyle}>
                        {result.id}
                      </td>

                      <td style={tdStyle}>
                        {result.ward}
                      </td>

                      <td style={tdStyle}>
                        {
                          result.polling_unit
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          result.party_agent
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          result.phone_number
                        }
                      </td>

                      <td style={tdStyle}>

                        <span
                          style={
                            pendingBadge
                          }
                        >

                          Pending

                        </span>

                      </td>

                      <td style={tdStyle}>

                        <input
                          type="checkbox"
                          checked={
                            targetSelections[
                              result.id
                            ] || false
                          }
                          onChange={(e) =>

                            setTargetSelections(
                              (prev) => ({
                                ...prev,
                                [result.id]:
                                  e.target.checked
                              })
                            )

                          }
                        />

                      </td>

                      <td style={tdStyle}>

                        <button

                          style={
                            approveButtonStyle
                          }

                          onClick={() =>
                          approveResult(
                          result.id,
                          targetSelections[
                          result.id
               ]
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

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const pageStyle = {

  padding: "20px"
};

const titleStyle = {

  marginBottom: "20px",

  fontSize: "32px",

  fontWeight: "700"
};

const summaryGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(250px,1fr))",

  gap: "15px",

  marginBottom: "20px"
};

const summaryCard = {

  backgroundColor:
    "#ffffff",

  padding: "20px",

  borderRadius: "10px",

  textAlign: "center",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const searchStyle = {

  width: "350px",

  padding: "10px",

  border:
    "1px solid #d1d5db",

  borderRadius:
    "8px",

  marginBottom:
    "20px",

  outline: "none"
};

const tableContainer = {

  backgroundColor:
    "#ffffff",

  borderRadius:
    "10px",

  overflowX:
    "auto",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const tableStyle = {

  width: "100%",

  borderCollapse:
    "collapse"
};

const thStyle = {

  backgroundColor:
    "#0f172a",

  color:
    "#ffffff",

  padding:
    "14px",

  border:
    "1px solid #334155",

  whiteSpace:
    "nowrap"
};

const tdStyle = {

  padding:
    "12px",

  border:
    "1px solid #e5e7eb",

  textAlign:
    "center"
};

const emptyStyle = {

  padding:
    "40px",

  textAlign:
    "center",

  color:
    "#64748b",

  fontWeight:
    "500"
};

const pendingBadge = {

  backgroundColor:
    "#f59e0b",

  color:
    "#ffffff",

  padding:
    "6px 12px",

  borderRadius:
    "20px",

  fontSize:
    "12px",

  fontWeight:
    "bold"
};

const approveButtonStyle = {

  padding:
    "8px 14px",

  marginRight:
    "10px",

  backgroundColor:
    "#16a34a",

  color:
    "#ffffff",

  border:
    "none",

  borderRadius:
    "6px",

  cursor:
    "pointer",

  fontWeight:
    "600"
};

const rejectButtonStyle = {

  padding:
    "8px 14px",

  backgroundColor:
    "#dc2626",

  color:
    "#ffffff",

  border:
    "none",

  borderRadius:
    "6px",

  cursor:
    "pointer",

  fontWeight:
    "600"
};

export default ApprovalPanel;