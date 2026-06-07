import SituationRoomDashboard
from "./pages/SituationRoomDashboard";
import CancelledResults
from "./CancelledResults";
import NotificationsDashboard
from "./pages/NotificationsDashboard";
import StateDashboard
from "./pages/StateDashboard";
import LgaDashboard from "./pages/LgaDashboard";
import WardDashboard from "./pages/WardDashboard";
import QuickActions
from "./components/QuickActions";
import PollingUnitDashboard
from "./pages/PollingUnitDashboard";
import ResultSubmission
from "./pages/ResultSubmission";
import Header from "./components/Header";
import AdminDashboard
from "./pages/AdminDashboard";
import ObserverDashboard
from "./pages/ObserverDashboard";
import CollationDashboard
from "./pages/CollationDashboard";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import UserManagement
from "./pages/UserManagement";
import SuperAdminDashboard
from "./pages/SuperAdminDashboard";
import RoleRoute from "./routes/RoleRoute";
import Sidebar from "./components/Sidebar";
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

      if (!token) {
        return;
      }

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

if (!token) {
  return;
}

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
APP ROUTES
====================================
*/

return (

  <BrowserRouter>

    <div
      style={{
        display: "flex",
        minHeight: "100vh"
      }}
    >

      <Sidebar />

      <div
        style={{
          flex: 1
        }}
      >

        <Header />

<QuickActions />

<div
  style={{
    padding: "20px"
  }}
>

          <Routes>
<Route
  path="/polling-units-live"
  element={
    <PollingUnitDashboard />
  }
/>

<Route
  path="/wards-live"
  element={<WardDashboard />}
/>

<Route
  path="/lgas-live"
  element={<LgaDashboard />}
/>

<Route
  path="/state-live"
  element={
    <StateDashboard />
  }
/>

<Route
  path="/notifications"
  element={
    <NotificationsDashboard />
  }
/>

<Route

  path="/cancelled-results"

  element={
    <CancelledResults />
  }
/>

<Route
  path="/fraud"
  element={
    <FraudDetection
      results={results}
    />
  }
/>

<Route
  path="/"
  element={<SituationRoomDashboard />}
/>

<Route
  path="/submit-result"
  element={
    <RoleRoute
      allowedRoles={[
        "super_admin",
        "collation_officer"
      ]}
    >
      <ResultSubmission />
    </RoleRoute>
  }
/>
            {/* SUPER ADMIN */}

            <Route
              path="/"
              element={
                <RoleRoute
                  allowedRoles={[
                    "super_admin"
                  ]}
                >
                  <SuperAdminDashboard />
                </RoleRoute>
              }
            />

            {/* USER MANAGEMENT */}

            <Route
              path="/users"
              element={
                <RoleRoute
                  allowedRoles={[
                    "super_admin"
                  ]}
                >
                  <UserManagement />
                </RoleRoute>
              }
            />

            {/* APPROVALS */}

            <Route
              path="/approvals"
              element={
                <RoleRoute
                  allowedRoles={[
                    "super_admin",
                    "admin"
                  ]}
                >
                  <ApprovalPanel />
                </RoleRoute>
              }
            />

            {/* AUDIT LOGS */}

            <Route
              path="/audit-logs"
              element={
                <RoleRoute
                  allowedRoles={[
                    "super_admin",
                    "admin"
                  ]}
                >
                  <AuditLogs />
                </RoleRoute>
              }
            />

            {/* FRAUD */}

            <Route
              path="/fraud"
              element={
                <FraudDetection />
              }
            />

            {/* NOTIFICATIONS */}

            <Route
              path="/notifications"
              element={
                <LiveNotifications
                  notifications={
                    notifications
                  }
                />
              }
            />

            {/* ANALYTICS */}

            <Route
              path="/analytics"
              element={
                <LiveCharts
                  stateSummary={
                    stateSummary
                  }
                />
              }
            />

            {/* ADMIN */}

            <Route
              path="/admin"
              element={
                <RoleRoute
                  allowedRoles={[
                    "admin",
                    "super_admin"
                  ]}
                >
                  <AdminDashboard />
                </RoleRoute>
              }
            />

            {/* OBSERVER */}

            <Route
              path="/observer"
              element={
                <RoleRoute
                  allowedRoles={[
                    "observer",
                    "super_admin"
                  ]}
                >
                  <ObserverDashboard />
                </RoleRoute>
              }
            />

            {/* COLLATION */}

            <Route
              path="/collation"
              element={
                <RoleRoute
                  allowedRoles={[
                    "collation_officer",
                    "super_admin"
                  ]}
                >
                  <CollationDashboard />
                </RoleRoute>
              }
            />

            {/* MAP */}

            <Route
              path="/map"
              element={
                <ElectionMap
                  results={results}
                />
              }
            />

          </Routes>

        </div>

      </div>

    </div>

  </BrowserRouter>

);
}

export default App;