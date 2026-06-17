import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  useNavigate
} from "react-router-dom";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

function QuickActions() {

  const navigate =
    useNavigate();

  const [
    notificationCount,
    setNotificationCount
  ] = useState(0);

  /*
  ====================================
  FETCH UNREAD NOTIFICATIONS
  ====================================
  */

  const fetchNotifications =
    async () => {

      try {

        const response =
          await axios.get(

            `${API_URL}/api/notifications/unread-count`
          );

        setNotificationCount(

          response.data.count || 0

        );

      } catch (error) {

        console.error(

          "Notification Error:",

          error
        );
      }
    };

  /*
  ====================================
  AUTO REFRESH
  ====================================
  */

  useEffect(() => {

    fetchNotifications();

    const interval =
      setInterval(

        fetchNotifications,

        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  const user =
  JSON.parse(
    localStorage.getItem("user")
  );

const role =
  user?.role;

  /*
  ====================================
  QUICK ACTIONS
  ====================================
  */

  const actions = [

  {
    icon: "📍",
    label: "Polling Units",
    path: "/polling-units-live"
  },

  {
    icon: "🗳️",
    label: "Wards",
    path: "/wards-live"
  },

  {
    icon: "🏢",
    label: "LGAs",
    path: "/lgas-live"
  },

  {
    icon: "🌍",
    label: "State",
    path: "/state-live"
  },

  ...(role === "super_admin"
    ? [
        {
          icon: "📄",
          label: "Export PDF",
          path: "/export-pdf"
        },

        {
          icon: "📊",
          label: "Export Excel",
          path: "/export-excel"
        }
      ]
    : []),

  {
    icon: "🔔",
    label: "Notifications",
    path: "/notifications"
  },

  {
  label:
    "Target Results",

  icon:
    "🎯",

  path:
    "/target-results",

  roles: [

    "super_admin",
    "admin",
    "observer"

  ]
},

];

  return (

    <div style={containerStyle}>

      {

        actions.map(
          (action) => (

            <button

              key={
                action.label
              }

              style={
                buttonStyle
              }

              onClick={() =>
                navigate(
                  action.path
                )
              }

              onMouseEnter={(e) => {

                e.currentTarget.style.transform =
                  "translateY(-3px)";

                e.currentTarget.style.boxShadow =
                  "0 6px 15px rgba(0,0,0,0.15)";
              }}

              onMouseLeave={(e) => {

                e.currentTarget.style.transform =
                  "translateY(0px)";

                e.currentTarget.style.boxShadow =
                  "0 2px 5px rgba(0,0,0,0.1)";
              }}
            >

              <div
                style={{
                  position:
                    "relative",

                  fontSize:
                    "28px",

                  marginBottom:
                    "8px"
                }}
              >

                {action.icon}

                {

                  action.label ===
                    "Notifications"

                  &&

                  notificationCount > 0

                  &&

                  <span
                    style={
                      badgeStyle
                    }
                  >

                    {

                      notificationCount > 99

                        ? "99+"

                        : notificationCount

                    }

                  </span>

                }

              </div>

              <div
                style={{
                  fontWeight:
                    "500",

                  fontSize:
                    "14px"
                }}
              >

                {action.label}

              </div>

            </button>

          )
        )

      }

    </div>

  );
}

/*
====================================
CONTAINER
====================================
*/

const containerStyle = {

  display: "flex",

  flexWrap: "wrap",

  gap: "15px",

  justifyContent: "center",

  marginTop: "10px",

  marginBottom: "25px"
};

/*
====================================
BUTTON
====================================
*/

const buttonStyle = {

  width: "120px",

  height: "90px",

  border:
    "1px solid #d1d5db",

  borderRadius:
    "12px",

  backgroundColor:
    "#ffffff",

  cursor:
    "pointer",

  boxShadow:
    "0 2px 5px rgba(0,0,0,0.1)",

  display:
    "flex",

  flexDirection:
    "column",

  alignItems:
    "center",

  justifyContent:
    "center",

  transition:
    "all 0.25s ease",

  position:
    "relative"
};

/*
====================================
BADGE
====================================
*/

const badgeStyle = {

  position:
    "absolute",

  top: "-8px",

  right: "-14px",

  backgroundColor:
    "#dc2626",

  color:
    "#ffffff",

  borderRadius:
    "50%",

  minWidth:
    "22px",

  height:
    "22px",

  display:
    "flex",

  alignItems:
    "center",

  justifyContent:
    "center",

  padding:
    "0 5px",

  fontSize:
    "11px",

  fontWeight:
    "bold",

  boxShadow:
    "0 2px 4px rgba(0,0,0,0.25)"
};

export default QuickActions;