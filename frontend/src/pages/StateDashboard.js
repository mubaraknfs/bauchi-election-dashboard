import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard-jjkdrh8lz.vercel.app";

function StateDashboard() {

  const [summary, setSummary] =
    useState(null);

  const fetchSummary =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/state-summary`
          );

        setSummary(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  useEffect(() => {

    fetchSummary();

    const interval =
      setInterval(
        fetchSummary,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);

  if (!summary) {

    return (
      <div
        style={{
          padding: "20px"
        }}
      >
        Loading...
      </div>
    );
  }

  const turnout =

    Number(
      summary.total_registered_voters
    ) > 0

      ?

      (
        (
          Number(
            summary.total_accredited_voters
          ) /

          Number(
            summary.total_registered_voters
          )

        ) * 100
      ).toFixed(2)

      : 0;

  const rejectedVotes =

    Number(
      summary.total_votes_cast || 0
    )

    -

    Number(
      summary.total_valid_votes || 0
    );

  const partyRanking = [

    ["AAC", summary.aac],
    ["ADC", summary.adc],
    ["ADP", summary.adp],
    ["APC", summary.apc],
    ["APGA", summary.apga],
    ["APM", summary.apm],
    ["APP", summary.app],
    ["BP", summary.bp],
    ["LP", summary.lp],
    ["NDC", summary.ndc],
    ["NNPP", summary.nnpp],
    ["NRM", summary.nrm],
    ["PDP", summary.pdp],
    ["PRP", summary.prp],
    ["SDP", summary.sdp],
    ["YPP", summary.ypp],
    ["ZLP", summary.zlp]

  ]

    .sort(
      (a, b) =>
        Number(b[1]) -
        Number(a[1])
    );

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
            "25px"
        }}
      >

        <h1>
          Bauchi State Live Dashboard
        </h1>

        <strong>
          {
            new Date()
              .toLocaleString()
          }
        </strong>

      </div>

      {/* SUMMARY CARDS */}

      <div style={summaryGrid}>

        <Card
          title="Registered Voters"
          value={
            Number(
              summary.total_registered_voters
            ).toLocaleString()
          }
        />

        <Card
          title="Accredited Voters"
          value={
            Number(
              summary.total_accredited_voters
            ).toLocaleString()
          }
        />

        <Card
          title="Votes Cast"
          value={
            Number(
              summary.total_votes_cast
            ).toLocaleString()
          }
        />

        <Card
          title="Valid Votes"
          value={
            Number(
              summary.total_valid_votes
            ).toLocaleString()
          }
        />

        <Card
          title="Rejected Votes"
          value={
            rejectedVotes.toLocaleString()
          }
        />

        <Card
          title="Polling Units Reported"
          value={
            Number(
              summary.polling_units_reported
            ).toLocaleString()
          }
        />

        <Card
          title="Turnout Rate"
          value={`${turnout}%`}
        />

        <Card
          title="Leading Party"
          value={
            summary.leading_party
          }
        />

      </div>

      {/* LEADING PARTY */}

      <div style={winnerCard}>

        <h2
          style={{
            marginBottom:
              "15px"
          }}
        >
          STATE LEADING PARTY
        </h2>

        <h1
          style={{
            color:
              "#16a34a",
            fontSize:
              "60px",
            margin: 0
          }}
        >
          {
            summary.leading_party
          }
        </h1>

      </div>

      {/* LEADERBOARD */}

      <div
        style={
          leaderboardContainer
        }
      >

        <h2
          style={{
            marginBottom:
              "25px"
          }}
        >
          Live Party Leaderboard
        </h2>

        {

          partyRanking.map(

            ([party, votes]) => {

              const percentage =

                Number(
                  summary.total_valid_votes
                ) > 0

                  ?

                  (
                    (
                      Number(votes) /

                      Number(
                        summary.total_valid_votes
                      )

                    ) * 100
                  ).toFixed(2)

                  : 0;

              return (

                <div
                  key={party}
                  style={{
                    marginBottom:
                      "18px"
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      marginBottom:
                        "6px"
                    }}
                  >

                    <strong>
                      {party}
                    </strong>

                    <strong>

                      {
                        Number(votes)
                          .toLocaleString()
                      }

                      {" votes • "}

                      {percentage}%

                    </strong>

                  </div>

                  <div
                    style={{
                      height:
                        "14px",
                      background:
                        "#e5e7eb",
                      borderRadius:
                        "20px",
                      overflow:
                        "hidden"
                    }}
                  >

                    <div
                      style={{
                        width:
                          `${percentage}%`,
                        height:
                          "100%",
                        background:
                          "#16a34a",
                        transition:
                          "0.5s"
                      }}
                    />

                  </div>

                </div>
              );
            }
          )
        }

      </div>

    </div>
  );
}

function Card({

  title,
  value

}) {

  return (

    <div style={cardStyle}>

      <h4>
        {title}
      </h4>

      <h2>
        {value}
      </h2>

    </div>
  );
}

const summaryGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",

  gap: "15px",

  marginBottom:
    "25px"
};

const cardStyle = {

  backgroundColor:
    "#ffffff",

  padding: "20px",

  borderRadius:
    "12px",

  textAlign:
    "center",

  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)"
};

const winnerCard = {

  backgroundColor:
    "#ffffff",

  padding: "35px",

  borderRadius:
    "12px",

  textAlign:
    "center",

  marginBottom:
    "25px",

  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)"
};

const leaderboardContainer = {

  backgroundColor:
    "#ffffff",

  padding: "30px",

  borderRadius:
    "12px",

  marginBottom:
    "25px",

  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)"
};

export default StateDashboard;