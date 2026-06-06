import React, {
  useEffect,
  useState,
  useMemo
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

function PollingUnitDashboard() {

  const [results, setResults] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedWard, setSelectedWard] =
    useState("");

  const [currentTime, setCurrentTime] =
    useState(new Date());

  const fetchResults =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/results`
          );

        setResults(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  useEffect(() => {

    fetchResults();

    const interval =
      setInterval(
        fetchResults,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);

  useEffect(() => {

    const timer =
      setInterval(() => {

        setCurrentTime(
          new Date()
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  const parties = [

    "aac",
    "adc",
    "adp",
    "apc",
    "apga",
    "apm",
    "app",
    "bp",
    "lp",
    "ndc",
    "nnpp",
    "nrm",
    "pdp",
    "prp",
    "sdp",
    "ypp",
    "zlp"
  ];

  const partyTotals =
    useMemo(() => {

      const totals = {};

      parties.forEach((party) => {

        totals[party] =
          results.reduce(

            (sum, row) =>

              sum +

              Number(
                row[party] || 0
              ),

            0
          );
      });

      return totals;

    }, [results]);

  const leadingParty =
    useMemo(() => {

      if (
        results.length === 0
      )
        return "-";

      return Object.keys(
        partyTotals
      ).reduce(

        (a, b) =>

          partyTotals[a] >
          partyTotals[b]

            ? a

            : b
      ).toUpperCase();

    }, [
      partyTotals,
      results
    ]);

  const totalVotesCast =
    useMemo(() => {

      return results.reduce(

        (sum, row) =>

          sum +

          Number(
            row.total_vote_cast || 0
          ),

        0
      );

    }, [results]);

  const wards =
    useMemo(() => {

      return [

        ...new Set(

          results.map(
            (r) => r.ward
          )
        )
      ];

    }, [results]);

  const filteredResults =
    useMemo(() => {

      return results.filter(
        (row) => {

          const matchesSearch =

            row.polling_unit
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesWard =

            selectedWard === ""

            ||

            row.ward ===
              selectedWard;

          return (
            matchesSearch &&
            matchesWard
          );
        }
      );

    }, [
      results,
      search,
      selectedWard
    ]);

  return (

    <div
      style={{
        padding: "20px"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom: "20px"
        }}
      >

        <h1>
          Polling Units Live Dashboard
        </h1>

        <div
          style={{
            fontWeight: "bold",
            color: "#334155"
          }}
        >
          {
            currentTime.toLocaleString()
          }
        </div>

      </div>

      {/* SUMMARY */}

      <div style={summaryGrid}>

        <div style={summaryCard}>
          <h3>
            Total Results
          </h3>
          <h2>
            {results.length}
          </h2>
        </div>

        <div style={summaryCard}>
          <h3>
            Approved
          </h3>
          <h2>
            {
              results.filter(
                (r) =>
                  r.status ===
                  "approved"
              ).length
            }
          </h2>
        </div>

        <div style={summaryCard}>
          <h3>
            Pending
          </h3>
          <h2>
            {
              results.filter(
                (r) =>
                  r.status ===
                  "pending"
              ).length
            }
          </h2>
        </div>

        <div style={summaryCard}>
          <h3>
            Cancelled
          </h3>
          <h2>
            {
              results.filter(
                (r) =>
                  r.status ===
                  "cancelled"
              ).length
            }
          </h2>
        </div>

        <div style={summaryCard}>
          <h3>
            Votes Cast
          </h3>
          <h2>
            {totalVotesCast}
          </h2>
        </div>

        <div style={summaryCard}>
          <h3>
            Leading Party
          </h3>
          <h2>
            {leadingParty}
          </h2>
        </div>

      </div>

      {/* FILTERS */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap"
        }}
      >

        <input
          type="text"
          placeholder="Search Polling Unit..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={filterStyle}
        />

        <select
          value={selectedWard}
          onChange={(e) =>
            setSelectedWard(
              e.target.value
            )
          }
          style={filterStyle}
        >

          <option value="">
            All Wards
          </option>

          {

            wards.map(
              (ward) => (

                <option
                  key={ward}
                  value={ward}
                >
                  {ward}
                </option>
              )
            )
          }

        </select>

      </div>

      {/* TABLE */}

      <div
        style={
          tableContainerStyle
        }
      >

        <table
          style={tableStyle}
        >

          <thead
            style={theadStyle}
          >

            <tr>

              <th style={th}>
                ID
              </th>

              <th style={th}>
                Ward
              </th>

              <th style={th}>
                Polling Unit
              </th>

              <th style={th}>AAC</th>
              <th style={th}>ADC</th>
              <th style={th}>ADP</th>
              <th style={th}>APC</th>
              <th style={th}>APGA</th>
              <th style={th}>APM</th>
              <th style={th}>APP</th>
              <th style={th}>BP</th>
              <th style={th}>LP</th>
              <th style={th}>NDC</th>
              <th style={th}>NNPP</th>
              <th style={th}>NRM</th>
              <th style={th}>PDP</th>
              <th style={th}>PRP</th>
              <th style={th}>SDP</th>
              <th style={th}>YPP</th>
              <th style={th}>ZLP</th>

              <th style={th}>
                Registered
              </th>

              <th style={th}>
                Accredited
              </th>

              <th style={th}>
                Votes Cast
              </th>

              <th style={th}>
                Rejected
              </th>

              <th style={th}>
                Valid
              </th>

              <th style={th}>
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {

              filteredResults.map(
                (row) => (

                  <tr
                    key={row.id}
                    style={{
                      backgroundColor:

                        row.status ===
                        "cancelled"

                          ? "#fee2e2"

                          : row.id %
                              2 ===
                            0

                          ? "#f8fafc"

                          : "#ffffff"
                    }}
                  >

                    <td style={td}>
                      {row.id}
                    </td>

                    <td style={td}>
                      {row.ward}
                    </td>

                    <td
                      style={{
                        ...td,
                        textAlign:
                          "left",
                        minWidth:
                          "350px"
                      }}
                    >
                      {
                        row.polling_unit
                      }
                    </td>

                    {

                      parties.map(
                        (
                          party
                        ) => (

                          <td
                            key={
                              party
                            }
                            style={
                              td
                            }
                          >
                            {
                              row[
                                party
                              ]
                            }
                          </td>
                        )
                      )
                    }

                    <td style={td}>
                      {
                        row.registered_card
                      }
                    </td>

                    <td style={td}>
                      {
                        row.accredited_card
                      }
                    </td>

                    <td style={td}>
                      {
                        row.total_vote_cast
                      }
                    </td>

                    <td style={td}>
                      {
                        row.total_vote_rejected
                      }
                    </td>

                    <td style={td}>
                      {
                        row.valid_vote
                      }
                    </td>

                    <td style={td}>

                      <span
                        style={{

                          backgroundColor:

                            row.status ===
                            "approved"

                              ? "#16a34a"

                              : row.status ===
                                "pending"

                              ? "#f59e0b"

                              : "#dc2626",

                          color:
                            "#fff",

                          padding:
                            "6px 12px",

                          borderRadius:
                            "20px",

                          fontSize:
                            "12px",

                          fontWeight:
                            "bold"
                        }}
                      >

                        {
                          row.status
                        }

                      </span>

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

const summaryGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",

  gap: "15px",

  marginBottom: "20px"
};

const summaryCard = {

  backgroundColor:
    "#ffffff",

  padding: "20px",

  borderRadius: "12px",

  textAlign: "center",

  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)"
};

const filterStyle = {

  padding: "10px",

  minWidth: "250px",

  border:
    "1px solid #cbd5e1",

  borderRadius: "8px"
};

const tableContainerStyle = {

  backgroundColor:
    "#ffffff",

  borderRadius: "12px",

  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)",

  overflow: "auto",

  maxHeight: "700px"
};

const tableStyle = {

  width: "100%",

  minWidth: "2400px",

  borderCollapse:
    "collapse"
};

const theadStyle = {

  position: "sticky",

  top: 0,

  zIndex: 100,

  backgroundColor:
    "#0f172a",

  color: "#fff"
};

const th = {

  padding: "12px",

  border:
    "1px solid #334155",

  whiteSpace:
    "nowrap"
};

const td = {

  padding: "10px",

  border:
    "1px solid #e2e8f0",

  textAlign:
    "center"
};

export default PollingUnitDashboard;