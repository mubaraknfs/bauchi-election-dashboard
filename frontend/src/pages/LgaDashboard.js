import React, {
  useEffect,
  useState,
  useMemo
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

function LgaDashboard() {

  const [lgas, setLgas] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [currentTime, setCurrentTime] =
    useState(new Date());

  const fetchLgas =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/lga-summaries`
          );

        setLgas(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  useEffect(() => {

    fetchLgas();

    const interval =
      setInterval(
        fetchLgas,
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

  const filteredLgas =
    useMemo(() => {

      return lgas.filter(
        (lga) =>

          lga.lga_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [
      lgas,
      search
    ]);

  const totalVotesCast =
    lgas.reduce(

      (sum, lga) =>

        sum +

        Number(
          lga.total_votes_cast || 0
        ),

      0
    );

  const totalValidVotes =
    lgas.reduce(

      (sum, lga) =>

        sum +

        Number(
          lga.total_valid_votes || 0
        ),

      0
    );

  const totalRegistered =
    lgas.reduce(

      (sum, lga) =>

        sum +

        Number(
          lga.total_registered_voters || 0
        ),

      0
    );

  const totalAccredited =
    lgas.reduce(

      (sum, lga) =>

        sum +

        Number(
          lga.total_accredited_voters || 0
        ),

      0
    );

  const leadingParty =
    lgas.length > 0

      ? lgas[0]
          .leading_party || "-"
      : "-";

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
          marginBottom: "20px"
        }}
      >

        <h1>
          LGA Live Dashboard
        </h1>

        <strong>
          {
            currentTime.toLocaleString()
          }
        </strong>

      </div>

      {/* SUMMARY */}

      <div style={summaryGrid}>

        <div style={summaryCard}>
          <h3>Total LGAs</h3>
          <h2>{lgas.length}</h2>
        </div>

        <div style={summaryCard}>
          <h3>Votes Cast</h3>
          <h2>{totalVotesCast}</h2>
        </div>

        <div style={summaryCard}>
          <h3>Valid Votes</h3>
          <h2>{totalValidVotes}</h2>
        </div>

        <div style={summaryCard}>
          <h3>Registered</h3>
          <h2>{totalRegistered}</h2>
        </div>

        <div style={summaryCard}>
          <h3>Accredited</h3>
          <h2>{totalAccredited}</h2>
        </div>

        <div style={summaryCard}>
          <h3>Leading Party</h3>
          <h2>{leadingParty}</h2>
        </div>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search LGA..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={searchStyle}
      />

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
                LGA
              </th>

              <th style={th}>
                APC
              </th>

              <th style={th}>
                PDP
              </th>

              <th style={th}>
                NNPP
              </th>

              <th style={th}>
                LP
              </th>

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
                Valid Votes
              </th>

              <th style={th}>
                PUs Reported
              </th>

              <th style={th}>
                Leading Party
              </th>

            </tr>

          </thead>

          <tbody>

            {

              filteredLgas.map(
                (row) => (

                  <tr
                    key={
                      row.lga_name
                    }
                  >

                    <td style={td}>
                      {
                        row.lga_name
                      }
                    </td>

                    <td style={td}>
                      {row.apc}
                    </td>

                    <td style={td}>
                      {row.pdp}
                    </td>

                    <td style={td}>
                      {row.nnpp}
                    </td>

                    <td style={td}>
                      {row.lp}
                    </td>

                    <td style={td}>
                      {
                        row.total_registered_voters
                      }
                    </td>

                    <td style={td}>
                      {
                        row.total_accredited_voters
                      }
                    </td>

                    <td style={td}>
                      {
                        row.total_votes_cast
                      }
                    </td>

                    <td style={td}>
                      {
                        row.total_valid_votes
                      }
                    </td>

                    <td style={td}>
                      {
                        row.polling_units_reported
                      }
                    </td>

                    <td style={td}>

                      <span
                        style={{
                          backgroundColor:
                            "#16a34a",
                          color:
                            "#fff",
                          padding:
                            "6px 12px",
                          borderRadius:
                            "20px",
                          fontWeight:
                            "bold"
                        }}
                      >

                        {
                          row.leading_party
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
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)"
};

const searchStyle = {
  width: "300px",
  padding: "10px",
  marginBottom: "20px",
  border:
    "1px solid #cbd5e1",
  borderRadius: "8px"
};

const tableContainerStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  overflow: "auto",
  maxHeight: "700px",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)"
};

const tableStyle = {
  width: "100%",
  borderCollapse:
    "collapse"
};

const theadStyle = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor:
    "#0f172a",
  color: "#fff"
};

const th = {
  padding: "12px",
  border:
    "1px solid #334155"
};

const td = {
  padding: "10px",
  border:
    "1px solid #e2e8f0",
  textAlign:
    "center"
};

export default LgaDashboard;