import ElectionMap
from "./ElectionMap";
import FraudDetection
from "./FraudDetection";
import LiveNotifications
from "./LiveNotifications";
import LiveCharts from "./LiveCharts";
import ExportExcel from "./ExportExcel";
import ExportPDF from "./ExportPDF";
import AuditLogs from "./AuditLogs";
import ApprovalPanel from "./ApprovalPanel";
import AdminPanel from "./AdminPanel";
import Login from "./Login";

import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,

  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid

} from "recharts";

import { io } from "socket.io-client";

/*
====================================
SOCKET CONNECTION
====================================
*/

const socket = io(
  "https://bauchi-election-dashboard.onrender.com"
);

function App() {

const user = JSON.parse(
  localStorage.getItem("user")
);
/*

  ====================================
  PARTY COLORS
  ====================================
  */

  const PARTY_COLORS = {

    AAC: "#8B0000",
    ADC: "#FFA500",
    ADP: "#800080",
    APC: "#008000",
    APGA: "#FF4500",
    APM: "#1E90FF",
    APP: "#A52A2A",
    BP: "#2F4F4F",
    LP: "#FFD700",
    NDC: "#20B2AA",
    NNPP: "#FF1493",
    NRM: "#708090",
    PDP: "#FF0000",
    PRP: "#8B4513",
    SDP: "#4B0082",
    YPP: "#00CED1",
    ZLP: "#696969"
  };

  /*
  ====================================
  STATES
  ====================================
  */

  const [parties, setParties] =
    useState([]);

  const [wards, setWards] =
    useState([]);

const [

  lgas,

  setLgas

] = useState([]);

  const [pollingUnits, setPollingUnits] =
    useState([]);

  const [results, setResults] =
    useState([]);

const [
  overvotingData,
  setOvervotingData
] = useState([]);

  const [
    allWardSummaries,
    setAllWardSummaries
  ] = useState([]);

  const [
    lgaSummaries,
    setLgaSummaries
  ] = useState([]);

  const [
    stateSummary,
    setStateSummary
  ] = useState(null);

const [
  auditLogs,
  setAuditLogs
] = useState([]);

const [
  notifications,
  setNotifications
] = useState([]);

  const [partyVotes, setPartyVotes] =
    useState({});

  const [formData, setFormData] =
  useState({

    /*
    ====================================
    LOCATION DATA
    ====================================
    */

    lga_id: "",

    ward_id: "",

    ward: "",

    polling_unit: "",

    /*
    ====================================
    VOTER DATA
    ====================================
    */

    registered_card: "",

    accredited_card: "",

    total_vote_cast: "",

    total_vote_rejected: "",

    valid_vote: "",

    /*
    ====================================
    OFFICIALS
    ====================================
    */

    party_agent: "",

    phone_number: "",

    presiding_officer: ""
  });

  /*
  ====================================
  FETCH PARTIES
  ====================================
  */

  const fetchParties = async () => {

    try {

      const response =
        await axios.get(
          "https://bauchi-election-dashboard.onrender.com/api/parties"
        );

      setParties(response.data);

      const initialVotes = {};

      response.data.forEach((party) => {

        initialVotes[
          party.code.toLowerCase()
        ] = "";
      });

      setPartyVotes(initialVotes);

    } catch (error) {

      console.error(error);
    }
  };

/*
====================================
FETCH LGAS
====================================
*/

const fetchLgas =
  async () => {

    try {

      const response =
        await axios.get(

          "https://bauchi-election-dashboard.onrender.com/api/lgas"
        );

      setLgas(
        response.data
      );

    } catch (error) {

      console.error(error);
    }
  };


  /*
  ====================================
  FETCH POLLING UNITS
  ====================================
  */

 const fetchPollingUnits =
  async (wardId) => {

    try {

      console.log(
        "WARD ID:",
        wardId
      );

      const response =
        await axios.get(

          `https://bauchi-election-dashboard.onrender.com/api/polling-units/${wardId}`
        );

      console.log(
        response.data
      );

      setPollingUnits(
        response.data
      );

    } catch (error) {

      console.error(
        error.response?.data
      );

      console.error(error);
    }
  };

  /*
  ====================================
  FETCH RESULTS
  ====================================
  */

  const fetchResults = async () => {

    try {

      const response =
        await axios.get(
          "https://bauchi-election-dashboard.onrender.com/results"
        );

      setResults(response.data);

    } catch (error) {

      console.error(error);
    }
  };

/*
====================================
FETCH OVERVOTING DATA
====================================
*/

const fetchOvervotingData =
  async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(

          "https://bauchi-election-dashboard.onrender.com/api/overvoting",

          {

            headers: {

              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setOvervotingData(

        response.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  /*
  ====================================
  FETCH WARD SUMMARIES
  ====================================
  */

  const fetchAllWardSummaries =
    async () => {

      try {

        const response =
          await axios.get(
            "https://bauchi-election-dashboard.onrender.com/api/all-ward-summaries"
          );

        setAllWardSummaries(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  /*
  ====================================
  FETCH LGA SUMMARIES
  ====================================
  */

  const fetchLgaSummaries =
    async () => {

      try {

        const response =
          await axios.get(
            "https://bauchi-election-dashboard.onrender.com/api/lga-summaries"
          );

        setLgaSummaries(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  /*
  ====================================
  FETCH STATE SUMMARY
  ====================================
  */

  const fetchStateSummary =
    async () => {

      try {

        const response =
          await axios.get(
            "https://bauchi-election-dashboard.onrender.com/api/state-summary"
          );

        setStateSummary(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

/*
====================================
FETCH AUDIT LOGS
====================================
*/

const fetchAuditLogs =
  async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(

          "https://bauchi-election-dashboard.onrender.com/api/audit-logs",

          {

            headers: {

              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setAuditLogs(
        response.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  /*
  ====================================
  INITIAL LOAD
  ====================================
  */

  useEffect(() => {

  fetchParties();

 fetchLgas();

  fetchResults();

fetchOvervotingData();

  fetchAllWardSummaries();

  fetchLgaSummaries();

  fetchStateSummary();

  fetchAuditLogs();

  /*
  ====================================
  REALTIME LISTENER
  ====================================
  */

  socket.on(

    "new_result",

    () => {

      fetchResults();
      
fetchOvervotingData();

      fetchAllWardSummaries();

      fetchLgaSummaries();

      fetchStateSummary();

      fetchAuditLogs();
    }
  );

  socket.on(

  "notification",

  (data) => {

    console.log(
      "NEW NOTIFICATION:",
      data
    );

    setNotifications((prev) => [

      data,

      ...prev
    ]);
  }
);

  return () => {

  
socket.off("new_result");

socket.off("notification");

  };

}, []);
  /*
  ====================================
  HANDLE INPUTS
  ====================================
  */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value
    });
  };

  /*
  ====================================
  HANDLE PARTY VOTES
  ====================================
  */

  const handlePartyVoteChange =
    (e) => {

      setPartyVotes({

        ...partyVotes,

        [e.target.name]:
          e.target.value
      });
    };

  /*
  ====================================
  SUBMIT RESULT
  ====================================
  */

  const submitResult = async () => {

    try {

const finalData = {

  ...formData,

  registered_card:

    Number(
      formData.registered_card
    ) || 0,

  accredited_card:

    Number(
      formData.accredited_card
    ) || 0,

  total_vote_cast:

    Number(
      formData.total_vote_cast
    ) || 0,

  total_vote_rejected:

    Number(
      formData.total_vote_rejected
    ) || 0,

  valid_vote:

    Number(
      formData.valid_vote
    ) || 0,

  ...Object.fromEntries(

    Object.entries(
      partyVotes
    ).map(

      ([key, value]) => [

        key,

        Number(value) || 0
      ]
    )
  )
};

      const token =
  localStorage.getItem(
    "token"
  );

if (

  !formData.polling_unit ||

  !formData.ward

) {

  alert(
    "Please select LGA, Ward and Polling Unit"
  );

  return;
}

const response =
  await axios.post(

    "https://bauchi-election-dashboard.onrender.com/submit-result",

    finalData,

    {

      headers: {

  Authorization:
    `Bearer ${token}`
}
    }
  );

      alert(
        response.data.message
      );

setFormData({

  lga_id: "",

  ward_id: "",

  ward: "",

  polling_unit: "",

  registered_card: "",

  accredited_card: "",

  total_vote_cast: "",

  total_vote_rejected: "",

  valid_vote: "",

  party_agent: "",

  phone_number: "",

  presiding_officer: ""
});

setPollingUnits([]);

setWards([]);

const clearedVotes = {};

parties.forEach((party) => {

  clearedVotes[
    party.code.toLowerCase()
  ] = "";
});

setPartyVotes(
  clearedVotes
);

    } catch (error) {

      console.error(error);

      alert(

  error.response?.data?.message

  ||

  "Failed to submit result"
);
    }
  };

  /*
  ====================================
  STATE TURNOUT
  ====================================
  */

  const stateTurnout =

    stateSummary

      ?

      (

        (
          Number(
            stateSummary.total_accredited_voters || 0
          )

          /

          Number(
            stateSummary.total_registered_voters || 1
          )

        ) * 100

      ).toFixed(1)

      :

      0;

  /*
  ====================================
  STATE CHART DATA
  ====================================
  */

  const stateChartData =

    stateSummary

      ?

      parties

        .map((party) => ({

          name: party.code,

          value: Number(

            stateSummary[
              party.code.toLowerCase()
            ] || 0
          )

        }))

        .filter(

          (party) => party.value > 0
        )

      :

      [];

/*
====================================
AUTH CHECK
====================================
*/

const token =
  localStorage.getItem(
    "token"
  );

if (!token) {

  return <Login />;
}


/*
====================================
RETURN UI
====================================
*/

return (

  <div style={containerStyle}>

    {/* ================================= */}
    {/* HEADER */}
    {/* ================================= */}

    <div style={headerStyle}>

      <h1 style={titleStyle}>
        Bauchi State Election Dashboard 2027
      </h1>

      <button

        onClick={() => {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          window.location.reload();
        }}

        style={logoutButtonStyle}
      >

        Logout

      </button>

    </div>
 <LiveNotifications
  notifications={notifications}
/>

      {/* ================================= */}
      {/* RESULT SUBMISSION */}
      {/* ================================= */}

      <div style={cardStyle}>

        <h2>
          Election Result Submission
        </h2>

{/* ================================= */}
{/* LGA */}
{/* ================================= */}

<select

  style={inputStyle}

  value={formData.lga_id || ""}

  onChange={async (e) => {

    const lgaId =
      e.target.value;

    console.log(
      "LGA SELECTED:",
      lgaId
    );

    /*
    ====================================
    RESET STATES
    ====================================
    */

    setWards([]);

    setPollingUnits([]);

    /*
    ====================================
    UPDATE FORM DATA
    ====================================
    */

    setFormData((prev) => ({

      ...prev,

      lga_id: lgaId,

      ward_id: "",

      ward: "",

      polling_unit: ""
    }));

    /*
    ====================================
    FETCH WARDS
    ====================================
    */

    try {

      const response =
        await axios.get(

          `https://bauchi-election-dashboard.onrender.com/api/wards-by-lga/${lgaId}`
        );

      console.log(
        "WARDS:",
        response.data
      );

      setWards(
        response.data
      );

    } catch (error) {

      console.error(
        "WARD ERROR:",
        error
      );
    }
  }}
>

  <option value="">
    Select LGA
  </option>

  {

    lgas.map((lga) => (

      <option

        key={lga.lga_id}

        value={lga.lga_id}
      >

        {lga.lga_name}

      </option>
    ))
  }

</select>

{/* ================================= */}
{/* WARD */}
{/* ================================= */}

<select

  style={inputStyle}

  value={formData.ward_id || ""}

  onChange={async (e) => {

    const wardId =
      e.target.value;

    console.log(
      "WARD SELECTED:",
      wardId
    );

    /*
    ====================================
    RESET POLLING UNIT
    ====================================
    */

    setPollingUnits([]);

    /*
    ====================================
    FIND SELECTED WARD
    ====================================
    */

    const selectedWard =
      wards.find(

        (ward) =>

          String(ward.ward_id)

          ===

          String(wardId)
      );

    console.log(
      "SELECTED WARD:",
      selectedWard
    );

    /*
    ====================================
    UPDATE FORM DATA
    ====================================
    */

    setFormData((prev) => ({

      ...prev,

      ward_id: wardId,

      ward:
        selectedWard
          ? selectedWard.ward_name
          : "",

      polling_unit: ""
    }));

    /*
    ====================================
    FETCH POLLING UNITS
    ====================================
    */

    try {

      const response =
        await axios.get(

          `https://bauchi-election-dashboard.onrender.com/api/polling-units/${wardId}`
        );

      console.log(
        "POLLING UNITS:",
        response.data
      );

      setPollingUnits(
        response.data
      );

    } catch (error) {

      console.error(
        "POLLING UNIT ERROR:",
        error
      );
    }
  }}
>

  <option value="">
    Select Ward
  </option>

  {

    wards.map((ward) => (

      <option

        key={ward.ward_id}

        value={ward.ward_id}
      >

        {ward.ward_name}

      </option>
    ))
  }

</select>

{/* ================================= */}
{/* POLLING UNIT */}
{/* ================================= */}

<select

  name="polling_unit"

  value={formData.polling_unit}

  onChange={(e) => {

    const pollingUnit =
      e.target.value;

    console.log(
      "POLLING UNIT SELECTED:",
      pollingUnit
    );

    /*
    ====================================
    UPDATE FORM DATA
    ====================================
    */

    setFormData((prev) => ({

      ...prev,

      polling_unit:
        pollingUnit
    }));
  }}

  style={inputStyle}
>

  <option value="">
    Select Polling Unit
  </option>

  {

    pollingUnits.map((unit) => (

      <option

        key={unit.polling_unit_id}

        value={unit.polling_unit_name}
      >

        {unit.polling_unit_code}

        {" - "}

        {unit.polling_unit_name}

      </option>
    ))
  }

</select>

{/* INPUTS */}

<input
  type="number"
  name="registered_card"
  placeholder="Registered Card"
  style={inputStyle}

  value={
    formData.registered_card || ""
  }

  onChange={handleChange}
/>

<input
  type="number"
  name="accredited_card"
  placeholder="Accredited Card"
  style={inputStyle}

  value={
    formData.accredited_card || ""
  }

  onChange={handleChange}
/>

<input
  type="number"
  name="total_vote_cast"
  placeholder="Total Vote Cast"
  style={inputStyle}

  value={
    formData.total_vote_cast || ""
  }

  onChange={handleChange}
/>

<input
  type="number"
  name="total_vote_rejected"
  placeholder="Rejected Votes"
  style={inputStyle}

  value={
    formData.total_vote_rejected || ""
  }

  onChange={handleChange}
/>

<input
  type="number"
  name="valid_vote"
  placeholder="Valid Votes"
  style={inputStyle}

  value={
    formData.valid_vote || ""
  }

  onChange={handleChange}
/>

        {/* PARTY VOTES */}

        <h2>
          Party Votes
        </h2>

        <div style={partyGridStyle}>

          {
            parties.map((party) => (

              <div
                key={party.id}
                style={partyCardStyle}
              >

                <strong>
                  {party.code}
                </strong>

                <input

                  type="number"

                  name={
                    party.code.toLowerCase()
                  }

                  value={
                    partyVotes[
                      party.code.toLowerCase()
                    ] || ""
                  }

                  onChange={
                    handlePartyVoteChange
                  }

                  placeholder={
                    `${party.code} Votes`
                  }

                  style={inputStyle}
                />

              </div>
            ))
          }

        </div>

        {/* OFFICIALS */}

        <input
          type="text"
          name="party_agent"
          placeholder="Party Agent"
          style={inputStyle}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          style={inputStyle}
          onChange={handleChange}
        />

        <input
          type="text"
          name="presiding_officer"
          placeholder="Presiding Officer"
          style={inputStyle}
          onChange={handleChange}
        />

        <button
          style={buttonStyle}
          onClick={submitResult}
        >

          Submit Result

        </button>

      </div>
      
{/* ================================= */}
{/* EXPORT BUTTONS */}
{/* ================================= */}

<div
  style={{
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap"
  }}
>

  <ExportPDF
    stateSummary={stateSummary}
  />

  <ExportExcel

    stateSummary={stateSummary}

    lgaSummaries={lgaSummaries}

    wardSummaries={allWardSummaries}

    pollingResults={results}

    auditLogs={auditLogs}
  />

</div>

      {/* ================================= */}
      {/* STATE SUMMARY */}
      {/* ================================= */}

      {
        stateSummary && (

          <>

            <div style={cardStyle}>

              <h2>
                Bauchi State Analytics
              </h2>

              <div style={{
                overflowX: "auto"
              }}>

                <table style={tableStyle}>

                  <thead>

                    <tr>

                      <th style={thStyle}>
                        State
                      </th>

                      {
                        parties.map((party) => (

                          <th
                            key={party.id}
                            style={thStyle}
                          >

                            {party.code}

                          </th>
                        ))
                      }

                      <th style={thStyle}>
                        Total Votes
                      </th>

                      <th style={thStyle}>
                        PUs Reported
                      </th>

                      <th style={thStyle}>
                        Leading Party
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    <tr>

                      <td style={tdStyle}>
                        {
                          stateSummary.state_name
                        }
                      </td>

                      {
                        parties.map((party) => (

                          <td
                            key={party.id}
                            style={tdStyle}
                          >

                            {
                              stateSummary[
                                party.code.toLowerCase()
                              ] || 0
                            }

                          </td>
                        ))
                      }

                      <td style={tdStyle}>
                        {
                          stateSummary.total_votes_cast
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          stateSummary.polling_units_reported
                        }
                      </td>

                      <td style={tdStyle}>

                        <strong>

                          {
                            stateSummary.leading_party
                          }

                        </strong>

                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

            {/* ANALYTICS CARDS */}

            <div style={analyticsGridStyle}>

              <div style={analyticsCardStyle}>

                <h3>
                  Leading Party
                </h3>

                <h1>
                  {
                    stateSummary.leading_party
                  }
                </h1>

              </div>

              <div style={analyticsCardStyle}>

                <h3>
                  Total Votes Cast
                </h3>

                <h1>
                  {
                    stateSummary.total_votes_cast
                  }
                </h1>

              </div>

              <div style={analyticsCardStyle}>

                <h3>
                  Polling Units Reported
                </h3>

                <h1>
                  {
                    stateSummary.polling_units_reported
                  }
                </h1>

              </div>

              <div style={analyticsCardStyle}>

                <h3>
                  Valid Votes
                </h3>

                <h1>
                  {
                    stateSummary.total_valid_votes
                  }
                </h1>

              </div>

              <div style={analyticsCardStyle}>

                <h3>
                  State Turnout
                </h3>

                <h1>
                  {stateTurnout}%
                </h1>

              </div>

            </div>

          </>
        )
      }

      {/* ================================= */}
      {/* PIE CHART */}
      {/* ================================= */}

      <div style={cardStyle}>

        <h2>
          State Vote Distribution
        </h2>

        <ResponsiveContainer
          width="100%"
          height={450}
        >

          <PieChart>

            <Pie

              data={stateChartData}

              dataKey="value"

              nameKey="name"

              outerRadius={140}

              label={({ name, percent }) =>

                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >

              {
                stateChartData.map(

                  (entry, index) => (

                    <Cell

                      key={`cell-${index}`}

                      fill={
                        PARTY_COLORS[
                          entry.name
                        ] || "#8884d8"
                      }
                    />
                  )
                )
              }

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* ================================= */}
      {/* BAR CHART */}
      {/* ================================= */}

      <div style={cardStyle}>

        <h2>
          State Party Comparison
        </h2>

        <ResponsiveContainer
          width="100%"
          height={450}
        >

          <BarChart
            data={stateChartData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar dataKey="value">

              {
                stateChartData.map(

                  (entry, index) => (

                    <Cell

                      key={`bar-${index}`}

                      fill={
                        PARTY_COLORS[
                          entry.name
                        ] || "#8884d8"
                      }
                    />
                  )
                )
              }

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ================================= */}
      {/* LGA ANALYTICS */}
      {/* ================================= */}

      <div style={cardStyle}>

        <h2>
          LGA Analytics Dashboard
        </h2>

        <div style={{
          overflowX: "auto"
        }}>

          <table style={tableStyle}>

            <thead>

              <tr>

                <th style={thStyle}>
                  LGA
                </th>

                {
                  parties.map((party) => (

                    <th
                      key={party.id}
                      style={thStyle}
                    >

                      {party.code}

                    </th>
                  ))
                }

                <th style={thStyle}>
                  Total Votes
                </th>

                <th style={thStyle}>
                  PUs Reported
                </th>

                <th style={thStyle}>
                  Leading Party
                </th>

              </tr>

            </thead>

            <tbody>

              {
                lgaSummaries.map(

                  (summary, index) => (

                    <tr key={index}>

                      <td style={tdStyle}>
                        {summary.lga_name}
                      </td>

                      {
                        parties.map((party) => (

                          <td
                            key={party.id}
                            style={tdStyle}
                          >

                            {
                              summary[
                                party.code.toLowerCase()
                              ] || 0
                            }

                          </td>
                        ))
                      }

                      <td style={tdStyle}>
                        {
                          summary.total_votes_cast
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          summary.polling_units_reported
                        }
                      </td>

                      <td style={tdStyle}>

                        <strong>

                          {
                            summary.leading_party
                          }

                        </strong>

                      </td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================= */}
      {/* WARD ANALYTICS */}
      {/* ================================= */}

      <div style={cardStyle}>

        <h2>
          Ward Analytics Dashboard
        </h2>

        <div style={{
          overflowX: "auto"
        }}>

          <table style={tableStyle}>

            <thead>

              <tr>

                <th style={thStyle}>
                  Ward
                </th>

                {
                  parties.map((party) => (

                    <th
                      key={party.id}
                      style={thStyle}
                    >

                      {party.code}

                    </th>
                  ))
                }

                <th style={thStyle}>
                  Total Votes
                </th>

                <th style={thStyle}>
                  PUs Reported
                </th>

                <th style={thStyle}>
                  Leading Party
                </th>

              </tr>

            </thead>

            <tbody>

              {
                allWardSummaries.map(

                  (summary, index) => (

                    <tr key={index}>

                      <td style={tdStyle}>
                        {summary.ward}
                      </td>

                      {
                        parties.map((party) => (

                          <td
                            key={party.id}
                            style={tdStyle}
                          >

                            {
                              summary[
                                party.code.toLowerCase()
                              ] || 0
                            }

                          </td>
                        ))
                      }

                      <td style={tdStyle}>
                        {
                          summary.total_votes_cast
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          summary.polling_units_reported
                        }
                      </td>

                      <td style={tdStyle}>

                        <strong>

                          {
                            summary.leading_party
                          }

                        </strong>

                      </td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

        </div>

      </div>

{
  user?.role ===
    "super_admin"

    &&

    <AdminPanel />
}
{
  (
    user?.role === "admin"

    ||

    user?.role === "super_admin"
  )

  &&

  <ApprovalPanel />
}
{
  (
    user?.role === "admin"

    ||

    user?.role === "super_admin"
  )

  &&

  <AuditLogs />
}
<LiveCharts
  stateSummary={stateSummary}
/>
<FraudDetection
  results={results}
/>

{/* ================================= */}
{/* OVERVOTING DASHBOARD */}
{/* ================================= */}

<div style={cardStyle}>

  <h2>

    Overvoting Detection Dashboard

  </h2>

  <div style={{
    overflowX: "auto"
  }}>

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
            Accredited
          </th>

          <th style={thStyle}>
            Total Votes
          </th>

          <th style={thStyle}>
            Excess Votes
          </th>

          <th style={thStyle}>
            Status
          </th>

        </tr>

      </thead>

      <tbody>

        {

          overvotingData.length > 0

          ? (

            overvotingData.map((item) => (

              <tr key={item.id}>

                <td style={tdStyle}>
                  {item.id}
                </td>

                <td style={tdStyle}>
                  {item.ward}
                </td>

                <td style={tdStyle}>
                  {item.polling_unit}
                </td>

                <td style={tdStyle}>
                  {item.accredited_card}
                </td>

                <td style={tdStyle}>
                  {item.total_vote_cast}
                </td>

                <td style={tdStyle}>

                  <strong>

                    {item.excess_votes}

                  </strong>

                </td>

                <td
                  style={{

                    ...tdStyle,

                    color: "red",

                    fontWeight: "bold"
                  }}
                >

                  OVERVOTING

                </td>

              </tr>
            ))

          ) : (

            <tr>

              <td
                colSpan="7"
                style={tdStyle}
              >

                No overvoting detected

              </td>

            </tr>
          )
        }

      </tbody>

    </table>

  </div>

</div>

<ElectionMap
  results={results}
/>
      {/* ================================= */}
      {/* LIVE RESULTS */}
      {/* ================================= */}

      <div style={cardStyle}>

        <h2>
          Live Polling Unit Results
        </h2>

        <div style={{
          overflowX: "auto"
        }}>

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

                {
                  parties.map((party) => (

                    <th
                      key={party.id}
                      style={thStyle}
                    >

                      {party.code}

                    </th>
                  ))
                }

              </tr>

            </thead>

            <tbody>

              {
                results.map((result) => (

                  <tr key={result.id}>

                    <td style={tdStyle}>
                      {result.id}
                    </td>

                    <td style={tdStyle}>
                      {result.ward}
                    </td>

                    <td style={tdStyle}>
                      {result.polling_unit}
                    </td>

                    {
                      parties.map((party) => (

                        <td
                          key={party.id}
                          style={tdStyle}
                        >

                          {
                            result[
                              party.code.toLowerCase()
                            ] || 0
                          }

                        </td>
                      ))
                    }

                  </tr>
                ))
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

/*
====================================
STYLES
====================================
*/

const containerStyle = {

  maxWidth: "1400px",

  margin: "20px auto",

  fontFamily: "Arial"
};

const headerStyle = {

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  marginBottom: "20px"
};

const titleStyle = {

  margin: 0
};

const cardStyle = {

  border: "1px solid #ccc",

  borderRadius: "10px",

  padding: "20px",

  marginBottom: "20px",

  backgroundColor: "#fff"
};

const inputStyle = {

  width: "100%",

  padding: "10px",

  marginBottom: "10px",

  borderRadius: "5px",

  border: "1px solid #ccc",

  boxSizing: "border-box"
};

const buttonStyle = {

  width: "100%",

  padding: "14px",

  backgroundColor: "green",

  color: "white",

  border: "none",

  borderRadius: "5px",

  cursor: "pointer",

  fontSize: "16px"
};

const logoutButtonStyle = {

  padding: "10px 20px",

  backgroundColor: "red",

  color: "white",

  border: "none",

  borderRadius: "5px",

  cursor: "pointer"
};

const tableStyle = {

  width: "100%",

  borderCollapse: "collapse"
};

const thStyle = {

  border: "1px solid #ccc",

  padding: "10px",

  backgroundColor: "#f0f0f0"
};

const tdStyle = {

  border: "1px solid #ccc",

  padding: "10px",

  textAlign: "center"
};

const partyGridStyle = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",

  gap: "10px",

  marginBottom: "20px"
};

const partyCardStyle = {

  border: "1px solid #ddd",

  borderRadius: "5px",

  padding: "10px",

  backgroundColor: "#f9f9f9"
};

const analyticsGridStyle = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",

  gap: "20px",

  marginBottom: "20px"
};

const analyticsCardStyle = {

  backgroundColor: "#f8f8f8",

  border: "1px solid #ddd",

  borderRadius: "10px",

  padding: "20px",

  textAlign: "center"
};

export default App;