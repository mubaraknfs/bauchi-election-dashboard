import React, {
  useEffect,
  useState,
  useMemo
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

function WardDashboard() {

  const [wards, setWards] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [currentTime, setCurrentTime] =
    useState(new Date());

  const parties = [

    "AAC",
    "ADC",
    "ADP",
    "APC",
    "APGA",
    "APM",
    "APP",
    "BP",
    "LP",
    "NDC",
    "NNPP",
    "NRM",
    "PDP",
    "PRP",
    "SDP",
    "YPP",
    "ZLP"

  ];

  const fetchWards =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/all-ward-summaries`
          );

        setWards(
          response.data
        );

      } catch (error) {

        console.error(
          "Ward fetch error:",
          error
        );
      }
    };

  useEffect(() => {

    fetchWards();

    const interval =
      setInterval(
        fetchWards,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  useEffect(() => {

    const timer =
      setInterval(() => {

        setCurrentTime(
          new Date()
        );

      }, 1000);

    return () =>
      clearInterval(
        timer
      );

  }, []);

  const filteredWards =
    useMemo(() => {

      return wards.filter(
        (ward) =>

          ward.ward
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [
      wards,
      search
    ]);

  const totalVotesCast =
    wards.reduce(

      (sum, ward) =>

        sum +

        Number(
          ward.total_votes_cast || 0
        ),

      0
    );

  const totalValidVotes =
    wards.reduce(

      (sum, ward) =>

        sum +

        Number(
          ward.total_valid_votes || 0
        ),

      0
    );

  const leadingParty =
    wards.length > 0

      ? wards[0]
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
          alignItems:
            "center",
          marginBottom: "20px"
        }}
      >

        <h1>
          Ward Live Dashboard
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
          <h3>
            Total Wards
          </h3>
          <h2>
            {wards.length}
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
            Valid Votes
          </h3>
          <h2>
            {totalValidVotes}
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

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search Ward..."
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
                Ward
              </th>

              {

                parties.map(
                  (party) => (

                    <th
                      key={party}
                      style={th}
                    >
                      {party}
                    </th>

                  )
                )

              }

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

              filteredWards.map(
                (row) => (

                  <tr
                    key={row.ward}
                  >

                    <td style={td}>
                      {row.ward}
                    </td>

                    {

                      parties.map(
                        (party) => (

                          <td
                            key={party}
                            style={td}
                          >
                            {

                              row[
                                party.toLowerCase()
                              ] || 0

                            }
                          </td>

                        )
                      )

                    }

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

/*
================================
STYLES
================================
*/

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

const searchStyle = {

  width: "300px",

  padding: "10px",

  marginBottom: "20px",

  border:
    "1px solid #cbd5e1",

  borderRadius: "8px"
};

const tableContainerStyle = {

  backgroundColor:
    "#ffffff",

  borderRadius: "12px",

  overflow: "auto",

  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)",

  maxHeight: "700px"
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

  color: "#ffffff"
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

export default WardDashboard;