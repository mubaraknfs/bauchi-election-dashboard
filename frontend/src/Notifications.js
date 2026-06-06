import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import { io }
from "socket.io-client";

/*
====================================
API
====================================
*/

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

/*
====================================
SOCKET
====================================
*/

const socket = io(API_URL);

function Notifications() {

  /*
  ====================================
  STATE
  ====================================
  */

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  /*
  ====================================
  LOAD NOTIFICATIONS
  ====================================
  */

  const fetchNotifications =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/notifications`
          );

        if (
          response.data &&
          response.data.notifications
        ) {

          setNotifications(
            response.data.notifications
          );

        } else if (
          Array.isArray(
            response.data
          )
        ) {

          setNotifications(
            response.data
          );
        }

      } catch (error) {

        console.error(
          "Fetch Notification Error:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  /*
  ====================================
  MARK ALL READ
  ====================================
  */

  const markNotificationsRead =
    async () => {

      try {

        await axios.put(
          `${API_URL}/api/notifications/read-all`
        );

      } catch (error) {

        console.error(
          "Read Notification Error:",
          error
        );
      }
    };

  /*
  ====================================
  INITIAL LOAD
  ====================================
  */

  useEffect(() => {

    fetchNotifications();

    markNotificationsRead();

  }, []);

  /*
  ====================================
  REALTIME SOCKET EVENTS
  ====================================
  */

  useEffect(() => {

    socket.on(

      "new_result_notification",

      (message) => {

        setNotifications(
          (prev) => [

            {
              id: Date.now(),
              event_type:
                "SUBMISSION",
              message,
              created_at:
                new Date()
            },

            ...prev
          ]
        );
      }
    );

    socket.on(

      "approval_notification",

      (message) => {

        setNotifications(
          (prev) => [

            {
              id: Date.now(),
              event_type:
                "APPROVAL",
              message,
              created_at:
                new Date()
            },

            ...prev
          ]
        );
      }
    );

    socket.on(

      "rejection_notification",

      (message) => {

        setNotifications(
          (prev) => [

            {
              id: Date.now(),
              event_type:
                "REJECTION",
              message,
              created_at:
                new Date()
            },

            ...prev
          ]
        );
      }
    );

    return () => {

      socket.off(
        "new_result_notification"
      );

      socket.off(
        "approval_notification"
      );

      socket.off(
        "rejection_notification"
      );
    };

  }, []);

  /*
  ====================================
  BADGE COLOR
  ====================================
  */

  const getBadgeColor =
    (type) => {

      switch (type) {

        case "APPROVAL":
          return "#16a34a";

        case "REJECTION":
          return "#dc2626";

        case "SUBMISSION":
          return "#2563eb";

        case "SYSTEM":
          return "#7c3aed";

        default:
          return "#475569";
      }
    };

  return (

    <div style={pageStyle}>

      <div style={headerStyle}>

        <h1
          style={{
            margin: 0
          }}
        >
          Live Notifications
        </h1>

        <div
          style={counterStyle}
        >
          Total:
          {" "}
          {
            notifications.length
          }
        </div>

      </div>

      {

        loading ?

          (

            <div style={emptyStyle}>
              Loading notifications...
            </div>

          )

          :

          notifications.length === 0 ?

          (

            <div style={emptyStyle}>
              No notifications available
            </div>

          )

          :

          notifications.map(

            (notification) => (

              <div

                key={
                  notification.id
                }

                style={
                  cardStyle
                }
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    marginBottom:
                      "10px"
                  }}
                >

                  <span
                    style={{
                      ...badgeStyle,

                      backgroundColor:
                        getBadgeColor(
                          notification.event_type
                        )
                    }}
                  >

                    {
                      notification.event_type
                    }

                  </span>

                  <span
                    style={{
                      color:
                        "#64748b",
                      fontSize:
                        "12px"
                    }}
                  >

                    {

                      notification.created_at

                        ?

                        new Date(
                          notification.created_at
                        ).toLocaleString()

                        :

                        ""
                    }

                  </span>

                </div>

                <div
                  style={{
                    fontSize:
                      "15px",
                    lineHeight:
                      "1.6"
                  }}
                >

                  {
                    notification.message
                  }

                </div>

              </div>
            )
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

const headerStyle = {

  display: "flex",

  justifyContent:
    "space-between",

  alignItems:
    "center",

  marginBottom: "20px"
};

const counterStyle = {

  backgroundColor:
    "#0f172a",

  color: "#fff",

  padding:
    "8px 16px",

  borderRadius:
    "20px",

  fontWeight:
    "bold"
};

const cardStyle = {

  backgroundColor:
    "#ffffff",

  border:
    "1px solid #e2e8f0",

  borderRadius:
    "12px",

  padding:
    "16px",

  marginBottom:
    "12px",

  boxShadow:
    "0 2px 6px rgba(0,0,0,0.08)"
};

const badgeStyle = {

  color: "#ffffff",

  padding:
    "6px 12px",

  borderRadius:
    "20px",

  fontSize:
    "12px",

  fontWeight:
    "bold"
};

const emptyStyle = {

  backgroundColor:
    "#ffffff",

  padding:
    "40px",

  borderRadius:
    "12px",

  textAlign:
    "center",

  color:
    "#64748b",

  border:
    "1px solid #e2e8f0"
};

export default Notifications;