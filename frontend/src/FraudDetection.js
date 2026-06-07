import React, {
  useMemo,
  useState
} from "react";

function FraudDetection({

  results = []

}) {

  const [search, setSearch] =
    useState("");

  /*
  ====================================
  FRAUD ANALYSIS
  ====================================
  */

  const suspicious =
    useMemo(() => {

      return results

        .map((row) => {

          const registered =
            Number(
              row.registered_card || 0
            );

          const accredited =
            Number(
              row.accredited_card || 0
            );

          const turnout =

            registered > 0

              ?

              (
                accredited /
                registered
              ) * 100

              :

              0;

          if (
            turnout > 95
          ) {

            return {

              ...row,

              turnout:
                turnout.toFixed(1),

              fraudType:
                "Excessive Turnout",

              risk:
                turnout >= 100
                  ? "HIGH"
                  : "MEDIUM"
            };
          }

          return null;

        })

        .filter(Boolean);

    }, [results]);

  /*
  ====================================
  FILTER
  ====================================
  */

  const filtered =
    suspicious.filter(

      (item) =>

        item.polling_unit
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        item.ward
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const avgTurnout =

    suspicious.length > 0

      ?

      (

        suspicious.reduce(

          (
            total,
            item
          ) =>

            total +
            Number(
              item.turnout
            ),

          0
        )

        /

        suspicious.length

      ).toFixed(1)

      :

      0;

  return (

    <div style={pageStyle}>

      <h1 style={titleStyle}>
        Fraud Detection Center
      </h1>

      {/* SUMMARY */}

      <div style={summaryGrid}>

        <div style={summaryCard}>
          <h4>
            Results Analysed
          </h4>
          <h1>
            {results.length}
          </h1>
        </div>

        <div style={summaryCard}>
          <h4>
            Fraud Alerts
          </h4>
          <h1>
            {suspicious.length}
          </h1>
        </div>

        <div style={summaryCard}>
          <h4>
            High Risk Cases
          </h4>
          <h1>
            {

              suspicious.filter(
                (x) =>
                  x.risk ===
                  "HIGH"
              ).length

            }
          </h1>
        </div>

        <div style={summaryCard}>
          <h4>
            Average Turnout
          </h4>
          <h1>
            {avgTurnout}%
          </h1>
        </div>

      </div>

      {/* SEARCH */}

      <input

        type="text"

        placeholder="Search polling unit or ward..."

        value={search}

        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }

        style={searchStyle}
      />

      {

        filtered.length === 0

          ?

          (

            <div style={safeStyle}>

              ✅ No suspicious activity detected

            </div>

          )

          :

          (

            <div style={tableContainer}>

              <table
                style={tableStyle}
              >

                <thead>

                  <tr>

                    <th style={thStyle}>
                      Ward
                    </th>

                    <th style={thStyle}>
                      Polling Unit
                    </th>

                    <th style={thStyle}>
                      Turnout
                    </th>

                    <th style={thStyle}>
                      Risk
                    </th>

                    <th style={thStyle}>
                      Fraud Type
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {

                    filtered.map(
                      (
                        item,
                        index
                      ) => (

                        <tr
                          key={
                            item.id
                          }
                          style={{
                            backgroundColor:

                              index % 2 === 0

                                ?

                                "#ffffff"

                                :

                                "#f8fafc"
                          }}
                        >

                          <td style={tdStyle}>
                            {
                              item.ward
                            }
                          </td>

                          <td style={tdStyle}>
                            {
                              item.polling_unit
                            }
                          </td>

                          <td style={tdStyle}>

                            <strong>

                              {
                                item.turnout
                              }%

                            </strong>

                          </td>

                          <td style={tdStyle}>

                            <span

                              style={{

                                padding:
                                  "5px 12px",

                                borderRadius:
                                  "20px",

                                color:
                                  "#fff",

                                fontWeight:
                                  "bold",

                                backgroundColor:

                                  item.risk ===
                                  "HIGH"

                                    ?

                                    "#dc2626"

                                    :

                                    "#f59e0b"
                              }}
                            >

                              {
                                item.risk
                              }

                            </span>

                          </td>

                          <td style={tdStyle}>
                            {
                              item.fraudType
                            }
                          </td>

                        </tr>
                      )
                    )

                  }

                </tbody>

              </table>

            </div>

          )

      }

    </div>
  );
}

/*
====================================
STYLES
====================================
*/

const pageStyle = {
  padding: "20px"
};

const titleStyle = {
  marginBottom: "20px",
  fontSize: "34px",
  fontWeight: "700"
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "15px",
  marginBottom: "20px"
};

const summaryCard = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "20px",
  textAlign: "center",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const searchStyle = {
  width: "350px",
  padding: "10px",
  border:
    "1px solid #d1d5db",
  borderRadius: "8px",
  marginBottom: "20px"
};

const tableContainer = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  overflow: "hidden",
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
  color: "#fff",
  padding: "14px",
  textAlign: "center"
};

const tdStyle = {
  padding: "14px",
  border:
    "1px solid #e5e7eb",
  textAlign: "center"
};

const safeStyle = {
  backgroundColor:
    "#f6ffed",
  border:
    "1px solid #b7eb8f",
  color: "#389e0d",
  padding: "15px",
  borderRadius: "8px",
  fontWeight: "600"
};

export default FraudDetection;