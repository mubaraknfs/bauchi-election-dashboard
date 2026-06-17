import React, {
  useEffect,
  useState,
  useMemo
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

function TargetResultsDashboard() {

  const [results, setResults] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [currentTime, setCurrentTime] =
    useState(new Date());

  const token =
    localStorage.getItem(
      "token"
    );

  /*
  ====================================
  FETCH TARGET RESULTS
  ====================================
  */

  const fetchResults =
    async () => {

      try {

        const response =
          await axios.get(

            `${API_URL}/api/target-results`,

            {
              headers: {
                authorization:
                  `Bearer ${token}`
              }
            }
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

  /*
  ====================================
  SEARCH
  ====================================
  */

  const filteredResults =
    useMemo(() => {

      return results.filter(
        (row) =>

          row.ward
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          row.polling_unit
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          row.party_agent
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [
      results,
      search
    ]);

  /*
  ====================================
  SUMMARY
  ====================================
  */

  const totalTargets =
    results.length;

  const totalRegistered =
    results.reduce(

      (sum, row) =>

        sum +

        Number(
          row.registered_card || 0
        ),

      0
    );

  const totalAccredited =
    results.reduce(

      (sum, row) =>

        sum +

        Number(
          row.accredited_card || 0
        ),

      0
    );

  const turnout =

    totalRegistered > 0

      ?

      (
        (
          totalAccredited /
          totalRegistered
        ) * 100
      ).toFixed(2)

      : 0;

  /*
  ====================================
  PARTY TOTALS
  ====================================
  */

  const partyTotals = {

    AAC: 0,
    ADC: 0,
    ADP: 0,
    APC: 0,
    APGA: 0,
    APM: 0,
    APP: 0,
    BP: 0,
    LP: 0,
    NDC: 0,
    NNPP: 0,
    NRM: 0,
    PDP: 0,
    PRP: 0,
    SDP: 0,
    YPP: 0,
    ZLP: 0

  };

  results.forEach(
    (row) => {

      partyTotals.AAC +=
        Number(
          row.aac || 0
        );

      partyTotals.ADC +=
        Number(
          row.adc || 0
        );

      partyTotals.ADP +=
        Number(
          row.adp || 0
        );

      partyTotals.APC +=
        Number(
          row.apc || 0
        );

      partyTotals.APGA +=
        Number(
          row.apga || 0
        );

      partyTotals.APM +=
        Number(
          row.apm || 0
        );

      partyTotals.APP +=
        Number(
          row.app || 0
        );

      partyTotals.BP +=
        Number(
          row.bp || 0
        );

      partyTotals.LP +=
        Number(
          row.lp || 0
        );

      partyTotals.NDC +=
        Number(
          row.ndc || 0
        );

      partyTotals.NNPP +=
        Number(
          row.nnpp || 0
        );

      partyTotals.NRM +=
        Number(
          row.nrm || 0
        );

      partyTotals.PDP +=
        Number(
          row.pdp || 0
        );

      partyTotals.PRP +=
        Number(
          row.prp || 0
        );

      partyTotals.SDP +=
        Number(
          row.sdp || 0
        );

      partyTotals.YPP +=
        Number(
          row.ypp || 0
        );

      partyTotals.ZLP +=
        Number(
          row.zlp || 0
        );

    }
  );

  const ranking =

    Object.entries(
      partyTotals
    )

      .sort(
        (a, b) =>
          b[1] - a[1]
      );

  const leadingParty =

    ranking.length > 0

      ? ranking[0][0]

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
          marginBottom:
            "20px"
        }}
      >

        <h1>
          Target Results Dashboard
        </h1>

        <strong>
          {
            currentTime.toLocaleString()
          }
        </strong>

      </div>

      {/* SUMMARY */}

      <div style={summaryGrid}>

        <div
          style={{
            ...summaryCard,
            background:
              "#dbeafe"
          }}
        >

          <h3>
            Targeted Results
          </h3>

          <h1>
            {totalTargets}
          </h1>

        </div>

        <div
          style={{
            ...summaryCard,
            background:
              "#dcfce7"
          }}
        >

          <h3>
            Registered
          </h3>

          <h1>
            {totalRegistered}
          </h1>

        </div>

        <div
          style={{
            ...summaryCard,
            background:
              "#fef3c7"
          }}
        >

          <h3>
            Accredited
          </h3>

          <h1>
            {totalAccredited}
          </h1>

        </div>

        <div
          style={{
            ...summaryCard,
            background:
              "#fee2e2"
          }}
        >

          <h3>
            Turnout
          </h3>

          <h1>
            {turnout}%
          </h1>

        </div>

        <div
          style={{
            ...summaryCard,
            background:
              "#ede9fe"
          }}
        >

          <h3>
            Leading Party
          </h3>

          <h1>
            {leadingParty}
          </h1>

        </div>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search ward, polling unit, agent..."
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
                ID
              </th>

              <th style={th}>
                Ward
              </th>

              <th style={th}>
                Polling Unit
              </th>

              <th style={th}>
                Agent
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
                APM
              </th>

              <th style={th}>
                ADC
              </th>

              <th style={th}>
                NDC
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
                  >

                    <td style={td}>
                      {row.id}
                    </td>

                    <td style={td}>
                      {row.ward}
                    </td>

                    <td style={td}>
                      {
                        row.polling_unit
                      }
                    </td>

                    <td style={td}>
                      {
                        row.party_agent
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
                      {row.apm}
                    </td>

                    <td style={td}>
                      {row.adc}
                    </td>

                    <td style={td}>
                      {row.ndc}
                    </td>

                    <td style={td}>

                      <span
                        style={{
                          background:
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

  marginBottom:
    "20px"

};

const summaryCard = {

  padding: "20px",

  borderRadius: "12px",

  textAlign: "center",

  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)"

};

const searchStyle = {

  width: "350px",

  padding: "10px",

  marginBottom:
    "20px",

  border:
    "1px solid #cbd5e1",

  borderRadius:
    "8px"

};

const tableContainerStyle = {

  backgroundColor:
    "#ffffff",

  borderRadius:
    "12px",

  overflow: "auto",

  maxHeight:
    "700px",

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

  color: "#ffffff"

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

export default TargetResultsDashboard;