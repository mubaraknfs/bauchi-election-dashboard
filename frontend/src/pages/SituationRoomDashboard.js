import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import partyConfig from "../config/partyConfig";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

const SUMMARY_API =
  `${API_URL}/api/dashboard-summary`;

const PARTY_API =
  `${API_URL}/api/party-results`;

const TICKER_API =
  `${API_URL}/api/lga-ticker`;

const partyColors = {

  apc: "#2e8b57",     // Green

  pdp: "#1e90ff",     // Blue

  nnpp: "#ff4500",    // Orange

  lp: "#32cd32",      // Light Green

  apm: "#8b0000",     // Dark Red

  adc: "#ffa500",     // Orange

  ndc: "#4169e1",     // Royal Blue

  app: "#dc143c",     // Crimson

  accord: "#9932cc",  // Purple

  aa: "#20b2aa",      // Teal

  aac: "#ff69b4",     // Pink

  adp: "#708090",

  apga: "#228b22",

  bp: "#8b4513",

  prp: "#483d8b",

  sdp: "#9400d3",

  yp: "#ff1493",

  ypp: "#ff6347",

  zlp: "#008080"

};

function SituationRoomDashboard() {

  const [summary, setSummary] =
  useState({});

  const [lgaSummaries, setLgaSummaries] =
  useState([]);

const [partyResults, setPartyResults] =
  useState({});

const [tickerData, setTickerData] =
  useState([]);

const [isMaximized, setIsMaximized] =
  useState(false);

useEffect(() => {

  loadData();

  const interval =
    setInterval(loadData, 30000);

  return () =>
    clearInterval(interval);

}, []);

async function loadData() {

  try {

    const [
      summaryRes,
      partyRes,
      tickerRes
    ] = await Promise.all([

      axios.get(SUMMARY_API),

      axios.get(PARTY_API),

      axios.get(TICKER_API)

    ]);

    setSummary(
      summaryRes.data
    );

    setPartyResults(
      partyRes.data
    );

    setTickerData(
      tickerRes.data
    );

  } catch (error) {

    console.error(error);

  }

}

const topParties =
  React.useMemo(() =>

    Object.entries(partyResults)

      .map(([key, votes]) => ({

        code: key,

        votes: Number(votes),

        ...partyConfig[key]

      }))

      .filter(
        party => party?.name
      )

      .sort(
        (a, b) =>
          b.votes - a.votes
      )

      .slice(0, 5),

    [partyResults]

  );

  const stateLeader =
  topParties.length > 0
    ? topParties[0]
    : null;
  const totalLGAs =
  tickerData.length;

const collatedLGAs =
  tickerData.filter(
    lga =>
      Number(
        lga.polling_units_reported
      ) > 0
  ).length;

const pendingLGAs =
  totalLGAs -
  collatedLGAs;

const partyLeaderboard =
  React.useMemo(() =>

    topParties.map(
      party => {

        let lgaLeadCount = 0;

        tickerData.forEach(
          (lga) => {

            const parties =
              Object.entries(lga)

                .filter(
                  ([key]) =>
                    partyConfig[key]
                )

                .map(
                  ([code, votes]) => ({
                    code,
                    votes:
                      Number(votes)
                  })
                )

                .sort(
                  (a, b) =>
                    b.votes -
                    a.votes
                );

            if (
              parties[0]
                ?.code ===
              party.code
            ) {

              lgaLeadCount++;

            }

          }
        );

        return {

          ...party,

          lgaLeadCount

        };

      }
    ),

    [
      topParties,
      tickerData
    ]

  );

  const topFiveTable =
  partyLeaderboard.slice(0, 5);

const currentDateTime =
  new Date().toLocaleString();

  const tickerText = tickerData

  .map((lga) => {

    const partyResultsText =

      Object.keys(partyConfig)

        .filter(
          (partyCode) =>
            Number(
              lga[partyCode] || 0
            ) > 0
        )

        .map(
          (partyCode) =>

            `${partyCode.toUpperCase()} ${
              lga[partyCode]
            }`
        )

        .join(" | ");

    return `${lga.lga_name} | ${partyResultsText}`;

  })

  .join("    ●    ");

  const totalVotes =
  topParties.reduce(
    (sum, party) =>
      sum + party.votes,
    0
  );

  const leadingParty =
  topParties.length > 0
    ? topParties[0]
    : null;

const leadingPercentage =
  leadingParty && totalVotes > 0
    ? (
        leadingParty.votes /
        totalVotes
      ) * 100
    : 0;

const TOTAL_BAUCHI_LGAS = 20;

/*
Every item returned by
/api/lga-ticker
represents one reporting LGA
*/
const lgasInProgress =
  tickerData.length;

const uncollatedLGAs =
  TOTAL_BAUCHI_LGAS -
  lgasInProgress;

  return (

  <div style={isMaximized ? maximizedContainerStyle : containerStyle}>

    {isMaximized && (
      <div style={exitMaximizeStyle}>
        <button
          onClick={() => setIsMaximized(false)}
          style={closeMaximizeButtonStyle}
          title="Exit Maximized View"
        >
          ✕
        </button>
      </div>
    )}

    <div style={tickerWrapper}>

  <div style={tickerDate}>
    {currentDateTime}
  </div>

  <div style={tickerScrollArea}>

    <div style={tickerContent}>
      {tickerText}
    </div>

  </div>

</div>

      <div style={headerStyle}>

        <h1 style={titleStyle}>
          Bauchi State Election Situation Room 2027
        </h1>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px" }}>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            style={maximizeButtonStyle}
            title={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? "⛶" : "⛶"}
          </button>
          <div style={liveStyle}>
            🔴 LIVE UPDATE
          </div>
          <span>
            Last Updated:
            {new Date().toLocaleTimeString()}
          </span>
        </div>

      </div>

      {leadingParty && (

  <div style={leaderBannerStyle}>

    <img
      src={leadingParty.logo}
      alt={leadingParty.name}
      style={{
        width: "50px",
        height: "50px",
        objectFit: "contain"
      }}
    />

    <div>

      <div
        style={{
          fontSize: "13px",
          color: "#666",
          fontWeight: "bold"
        }}
      >
        LEADING PARTY
      </div>

      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color:
            partyColors[
              leadingParty.code
            ] || "#000"
        }}
      >
        {leadingParty.name}
      </div>

      <div
        style={{
          fontSize: "14px"
        }}
      >
        {leadingParty.votes}
        {" "}
        Votes
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#666"
        }}
      >
        {leadingPercentage.toFixed(1)}%
        {" "}
        of Top Party Votes
      </div>

    </div>

  </div>

)}

<div
  style={{
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "10px",
    overflow: "hidden"
  }}
>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(5, 1fr)"
    }}
  >

    {topFiveTable.map(
      (party) => (

        <div
          key={party.code}
          style={{
            textAlign: "center",
            padding: "8px 6px",
            borderRight:
              "1px solid #eee",
            fontSize: "13px"
          }}
        >

          <img
            src={party.logo}
            alt={party.name}
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
              marginBottom: "4px"
            }}
          />

          <div
            style={{
              fontWeight: "bold",
              color:
                partyColors[
                  party.code
                ],
              fontSize: "12px"
            }}
          >
            {party.name}
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "2px"
            }}
          >
            {party.votes}
          </div>

          <div style={{ fontSize: "11px" }}>
            {party.lgaLeadCount}
            {" "}
            LGAs
          </div>

        </div>

      )
    )}

  </div>

</div>

      <div style={contentStyle}>

  <div style={fullWidthStyle}>

  <h2 style={{ margin: "8px 0 8px 0", fontSize: "18px" }}>
  Election Scores
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
  "repeat(auto-fit,minmax(180px,1fr))",
    gap: "6px",
    marginBottom: "10px"
  }}
>

  <div
  style={{
    background: "#dbeafe",
    border: "1px solid #3b82f6",
    color: "#1e3a8a",
    borderRadius: "6px",
    padding: "8px 10px",
    textAlign: "center",
    fontSize: "14px"
  }}
>
    <h3 style={{ margin: "2px 0" }}>{summary.registered || 0}</h3>
    <p style={{ margin: "2px 0", fontSize: "11px" }}>Registered Voters</p>
  </div>

 <div
  style={{
    background: "#dcfce7",
    border: "1px solid #16a34a",
    color: "#166534",
    borderRadius: "6px",
    padding: "8px 10px",
    textAlign: "center",
    fontSize: "14px"
  }}
>
    <h3 style={{ margin: "2px 0" }}>{summary.accredited || 0}</h3>
    <p style={{ margin: "2px 0", fontSize: "11px" }}>Accredited Voters</p>
  </div>

  <div
  style={{
    background: "#fee2e2",
border: "1px solid #ef4444",
color: "#991b1b",
    borderRadius: "6px",
    padding: "8px 10px",
    textAlign: "center",
    fontSize: "14px"
  }}
>
    <h3 style={{ margin: "2px 0" }}>{summary.valid_votes || 0}</h3>
    <p style={{ margin: "2px 0", fontSize: "11px" }}>Valid Votes</p>
  </div>

  <div
  style={{
    background: "#f3f4f6",
border: "1px solid #6b7280",
color: "#374151",
    borderRadius: "6px",
    padding: "8px 10px",
    textAlign: "center",
    fontSize: "14px"
  }}
>
    <h3 style={{ margin: "2px 0" }}>{summary.approved_results || 0}</h3>
    <p style={{ margin: "2px 0", fontSize: "11px" }}>Approved</p>
  </div>

  <div
  style={{
    background: "#fee2e2",
border: "1px solid #ef4444",
color: "#991b1b",
    borderRadius: "6px",
    padding: "8px 10px",
    textAlign: "center",
    fontSize: "14px"
  }}
>
    <h3 style={{ margin: "2px 0" }}>{summary.pending_results || 0}</h3>
    <p style={{ margin: "2px 0", fontSize: "11px" }}>Pending</p>
  </div>

  <div
  style={{
    background: "#f3f4f6",
border: "1px solid #6b7280",
color: "#374151",
    borderRadius: "6px",
    padding: "8px 10px",
    textAlign: "center",
    fontSize: "14px"
  }}
>
    <h3 style={{ margin: "2px 0" }}>{summary.cancelled_results || 0}</h3>
    <p style={{ margin: "2px 0", fontSize: "11px" }}>Cancelled</p>
  </div>

</div>

<div>

<div
  style={{
    marginBottom: "8px"
  }}
>

  <h3 style={{ margin: "6px 0", fontSize: "16px" }}>
    LGA Progress
  </h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(3,1fr)",
      gap: "6px"
    }}
  >

    <div
  style={{
    ...statCard,
    background: "#e0f2fe",
    border: "1px solid #0284c7",
    padding: "8px 6px"
  }}
>
  <h2 style={{ margin: "2px 0", fontSize: "20px" }}>20</h2>
  <p style={{ margin: "2px 0", fontSize: "11px" }}>Total LGAs</p>
</div>

    <div
  style={{
    ...statCard,
    background: "#fef3c7",
    border: "1px solid #f59e0b",
    padding: "8px 6px"
  }}
>
  <h2 style={{ margin: "2px 0", fontSize: "20px" }}>{lgasInProgress}</h2>
  <p style={{ margin: "2px 0", fontSize: "11px" }}>LGAs In Progress</p>
</div>

    <div
  style={{
    ...statCard,
    background: "#fee2e2",
    border: "1px solid #ef4444",
    padding: "8px 6px"
  }}
>
  <h2 style={{ margin: "2px 0", fontSize: "20px" }}>{uncollatedLGAs}</h2>
  <p style={{ margin: "2px 0", fontSize: "11px" }}>Uncollated LGAs</p>
</div>

  </div>

</div>

  <h3
    style={{
      marginBottom: "8px",
      fontSize: "16px"
    }}
  >
    Leading Parties
  </h3>

  {topParties.map((party) => {

    const percentage =
      totalVotes > 0
        ? (
            party.votes /
            totalVotes
          ) * 100
        : 0;

    return (

      <div
        key={party.code}
        style={{
          marginBottom: "4px",
          maxWidth: "100%"
        }}
      >

        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "8px",
    width: "100%"
  }}
>

  <img
    src={party.logo}
    alt={party.name}
    style={{
      width: "50px",
      height: "50px",
      objectFit: "contain"
    }}
  />

  <div
    style={{
      flex: 1,
      minWidth: 0
    }}
  >

    <strong>
      {party.name}
    </strong>

    <div>
      Votes: {party.votes}
    </div>

  </div>

  <div
    style={{
      width: "70px",
      textAlign: "right",
      fontWeight: "bold",
      flexShrink: 0
    }}
  >
    {percentage.toFixed(1)}%
  </div>

</div>

<div
  style={{
    width: "calc(100% - 80px)",
    height: "12px",
    background: "#eee",
    borderRadius: "20px",
    overflow: "hidden"
  }}
>

          <div
            style={{
              width:
                `${percentage}%`,
              height: "100%",
              background:
              partyColors[
              party.code
              ] || "#ff4d4f",
              borderRadius:
                "10px"
            }}
          />

        </div>

      </div>

    );

  })}

</div>

</div>


      </div>

    </div>

  );

}

const containerStyle = {
  padding: "10px 15px",
  paddingBottom: "65px",
  height: "calc(100vh - 100px)",
  overflowY: "auto"
};

const maximizedContainerStyle = {
  padding: "10px 15px",
  paddingBottom: "65px",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  backgroundColor: "#fff",
  zIndex: 9998,
  overflowY: "auto",
  overflowX: "auto"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
  gap: "10px",
  flexWrap: "wrap"
};

const titleStyle = {
  margin: 0,
  fontSize: "22px"
};

const liveStyle = {
  background: "#ff4d4f",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "20px",
  fontWeight: "bold",
  fontSize: "12px",
  whiteSpace: "nowrap"
};

const fullWidthStyle = {

  background: "#fff",

  border: "1px solid #ddd",

  borderRadius: "8px",

  padding: "12px",

  width: "100%"
};

const leaderBannerStyle = {

  display: "flex",

  alignItems: "center",

  gap: "12px",

  background: "#fff",

  border: "2px solid #eee",

  borderLeft: "6px solid gold",

  borderRadius: "8px",

  padding: "12px",

  marginBottom: "12px",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const contentStyle = {
  display: "block"
};

const tickerWrapper = {

  position: "fixed",

  bottom: 0,

  left: 0,

  width: "100%",

  background: "#111",

  color: "#fff",

  overflow: "hidden",

  height: "45px",

  zIndex: 9999,

  display: "flex",

  alignItems: "center"
};

const tickerDate = {

  minWidth: "220px",

  height: "100%",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  background: "#c00000",

  color: "#ffffff",

  fontWeight: "bold",

  borderRight: "2px solid #ffffff",

  zIndex: 10000
};

const tickerScrollArea = {

  flex: 1,

  overflow: "hidden",

  display: "flex",

  alignItems: "center"
};

const tickerContent = {

  whiteSpace: "nowrap",

  display: "inline-block",

  paddingLeft: "100%",

  animation:
    "tickerMove 60s linear infinite",

  fontWeight: "bold",

  fontSize: "16px"
};

const statCard = {

  background: "#ffffff",

  border: "1px solid #e5e7eb",

  borderRadius: "8px",

  padding: "10px 8px",

  textAlign: "center",

  boxShadow:
    "0 2px 4px rgba(0,0,0,0.05)"
};

const maximizeButtonStyle = {
  background: "#f0f0f0",
  border: "1px solid #ddd",
  borderRadius: "4px",
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  color: "#333"
};

const closeMaximizeButtonStyle = {
  position: "absolute",
  top: "15px",
  right: "15px",
  background: "#ff4d4f",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  fontSize: "24px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10001,
  transition: "all 0.3s ease"
};

const exitMaximizeStyle = {
  position: "relative",
  marginBottom: "20px"
};

export default React.memo(
  SituationRoomDashboard
);