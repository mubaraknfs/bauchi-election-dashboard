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

const [partyResults, setPartyResults] =
  useState({});

const [tickerData, setTickerData] =
  useState([]);

useEffect(() => {

  loadData();

  const interval =
    setInterval(loadData, 10000);

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
  Object.entries(partyResults)

    .map(([key, votes]) => ({

      code: key,

      votes: Number(votes),

      ...partyConfig[key]

    }))

    .filter(
      party =>
        party?.name
    )

    .sort(
      (a, b) =>
        b.votes - a.votes
    )

    .slice(0, 5);

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
  topParties.map(
    party => {

      let lgaLeadCount = 0;

      tickerData.forEach(
        lga => {

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
  );

  const topFiveTable =
  partyLeaderboard.slice(0, 5);

  const tickerText = tickerData

  .map((lga) =>

    `${lga.lga_name}
     | APC ${lga.apc}
     | PDP ${lga.pdp}
     | NNPP ${lga.nnpp}
     | LP ${lga.lp}
     | APM ${lga.apm}
     | NDC ${lga.ndc}
     |`

  )

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

  const lgaLeaders = {};

tickerData.forEach((lga) => {

  let winner = "";
  let maxVotes = -1;

  Object.keys(partyConfig).forEach((party) => {

    const votes =
      Number(lga[party] || 0);

    if (votes > maxVotes) {

      maxVotes = votes;
      winner = party;

    }

  });

  if (winner) {

    lgaLeaders[winner] =
      (lgaLeaders[winner] || 0) + 1;

  }

});

  return (

  <div style={containerStyle}>

    <div style={tickerWrapper}>

      <div style={tickerContent}>

        {tickerText}

      </div>

    </div>

      <div style={headerStyle}>

        <h1 style={titleStyle}>
          Bauchi State Election Situation Room 2027
        </h1>

        <div style={liveStyle}>
          🔴 LIVE UPDATE
        </div>
        Last Updated:
        {new Date().toLocaleTimeString()}

      </div>

      {leadingParty && (

  <div style={leaderBannerStyle}>

    <img
      src={leadingParty.logo}
      alt={leadingParty.name}
      style={{
        width: "80px",
        height: "80px",
        objectFit: "contain"
      }}
    />

    <div>

      <div
        style={{
          fontSize: "14px",
          color: "#666",
          fontWeight: "bold"
        }}
      >
        LEADING PARTY
      </div>

      <div
        style={{
          fontSize: "32px",
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
          fontSize: "18px"
        }}
      >
        {leadingParty.votes}
        {" "}
        Votes
      </div>

      <div
        style={{
          fontSize: "16px",
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
    borderRadius: "12px",
    marginBottom: "20px",
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
            padding: "15px",
            borderRight:
              "1px solid #eee"
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
              fontWeight: "bold",
              color:
                partyColors[
                  party.code
                ]
            }}
          >
            {party.name}
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: "bold"
            }}
          >
            {party.votes}
          </div>

          <div>
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

        <div style={leftStyle}>

  <h2>
  Election Scores
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "25px"
  }}
>

  <div
  style={{
    background: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center"
  }}
>
    <h3>{summary.registered || 0}</h3>
    <p>Registered</p>
  </div>

 <div
  style={{
    background: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center"
  }}
>
    <h3>{summary.accredited || 0}</h3>
    <p>Accredited</p>
  </div>

  <div
  style={{
    background: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center"
  }}
>
    <h3>{summary.valid_votes || 0}</h3>
    <p>Valid Votes</p>
  </div>

  <div
  style={{
    background: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center"
  }}
>
    <h3>{summary.approved_results || 0}</h3>
    <p>Approved</p>
  </div>

  <div
  style={{
    background: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center"
  }}
>
    <h3>{summary.pending_results || 0}</h3>
    <p>Pending</p>
  </div>

  <div
  style={{
    background: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center"
  }}
>
    <h3>{summary.cancelled_results || 0}</h3>
    <p>Cancelled</p>
  </div>

</div>

<div>

  <h3
    style={{
      marginBottom: "20px"
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
          marginBottom: "20px"
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "8px"
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
              flex: 1
            }}
          >

            <strong>
              {party.name}
            </strong>

            <div>
              Votes:
              {" "}
              {party.votes}
            </div>

          </div>

          <strong>
            {percentage.toFixed(1)}%
          </strong>

        </div>

        <div
          style={{
            width: "100%",
            height: "12px",
            background: "#eee",
            borderRadius: "20px"
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
                "20px"
            }}
          />

        </div>

      </div>

    );

  })}

</div>

</div>

        <div style={rightStyle}>

  <h2>
    Party Scoreboard
  </h2>

  {partyLeaderboard.map(
    (party) => (

      <div
        key={party.code}
        style={{
          display: "grid",
          gridTemplateColumns:
            "60px 1fr 80px",
          alignItems:
            "center",
          padding:
            "12px 0",
          borderBottom:
            "1px solid #eee"
        }}
      >

        <img
          src={party.logo}
          alt={party.name}
          style={{
            width: "40px",
            height: "40px",
            objectFit:
              "contain"
          }}
        />

        <div>

          <strong
          style={{
          color:
          partyColors[
          party.code
          ] || "#333"
     }}
    >
         {party.name}
         </strong>

          <div>
            {party.votes}
            {" "}
            Votes
          </div>

        </div>

        <div
          style={{
            textAlign:
              "center",
            fontWeight:
              "bold"
          }}
        >
          {party.lgaLeadCount}
          <br />
          LGAs
        </div>

      </div>

    )
  )}

  <div
    style={{
      marginTop: "25px",
      border:
        "1px solid #eee",
      borderRadius:
        "10px",
      overflow:
        "hidden"
    }}
  >

    <div
      style={{
        background:
          "#ff6b6b",
        color:
          "#fff",
        textAlign:
          "center",
        padding:
          "12px",
        fontWeight:
          "bold"
      }}
    >
      TOTAL LGAs
      {" "}
      {totalLGAs}
    </div>

    <div
      style={{
        display:
          "grid",
        gridTemplateColumns:
          "1fr 1fr"
      }}
    >

      <div
        style={{
          textAlign:
            "center",
          padding:
            "20px",
          borderRight:
            "1px solid #eee"
        }}
      >
        <strong>
          COLLATED
        </strong>

        <div>
          {collatedLGAs}
        </div>
      </div>

      <div
        style={{
          textAlign:
            "center",
          padding:
            "20px"
        }}
      >
        <strong>
          PENDING
        </strong>

        <div>
          {pendingLGAs}
        </div>
      </div>

    </div>

  </div>

</div>

      </div>

    </div>

  );

}

const containerStyle = {
  padding: "25px",
  paddingBottom: "70px"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px"
};

const titleStyle = {
  margin: 0,
  fontSize: "36px"
};

const liveStyle = {
  background: "#ff4d4f",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: "25px",
  fontWeight: "bold"
};

const leaderBannerStyle = {

  display: "flex",

  alignItems: "center",

  gap: "20px",

  background: "#fff",

  border: "2px solid #eee",

  borderLeft: "8px solid gold",

  borderRadius: "12px",

  padding: "20px",

  marginBottom: "25px",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const contentStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px"
};

const leftStyle = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "12px",
  minHeight: "500px",
  padding: "20px"
};

const rightStyle = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "12px",
  minHeight: "500px",
  padding: "20px"
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

  background: "#fafafa",

  border: "1px solid #ddd",

  borderRadius: "10px",

  padding: "15px",

  textAlign: "center"
};

export default SituationRoomDashboard;