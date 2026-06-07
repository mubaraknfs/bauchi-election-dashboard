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

  return (

    <div style={containerStyle}>

      <div style={headerStyle}>

        <h1 style={titleStyle}>
          Bauchi State Election Situation Room 2027
        </h1>

        <div style={liveStyle}>
          🔴 LIVE UPDATE
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

  {topParties.map((party) => (

    <div
      key={party.code}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "15px",
        padding: "10px",
        borderBottom:
          "1px solid #eee"
      }}
    >

      <img
        src={party.logo}
        alt={party.name}
        style={{
          width: "60px",
          height: "60px",
          objectFit: "contain"
        }}
      />

      <div
        style={{
          flex: 1
        }}
      >

        <div
          style={{
            fontWeight: "bold",
            fontSize: "18px"
          }}
        >
          {party.name}
        </div>

        <div>
          Votes:
          {" "}
          {party.votes}
        </div>

      </div>

    </div>

  ))}

</div>

</div>

        <div style={rightStyle}>
          RIGHT PANEL
        </div>

      </div>

    </div>

  );

}

const containerStyle = {
  padding: "25px"
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

const statCard = {

  background: "#fafafa",

  border: "1px solid #ddd",

  borderRadius: "10px",

  padding: "15px",

  textAlign: "center"
};

export default SituationRoomDashboard;