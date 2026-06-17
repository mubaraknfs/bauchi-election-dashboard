import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";
import { io } from "socket.io-client";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

const socket = io(API_URL);

function Notifications() {

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    search,
    setSearch
  ] = useState("");

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

        let data = [];

        if (
          response.data &&
          response.data.notifications
        ) {

          data =
            response.data.notifications;

        } else if (
          Array.isArray(
            response.data
          )
        ) {

          data = response.data;
        }

        setNotifications(data);

      } catch (error) {

        console.error(error);

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

        console.error(error);
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
  REALTIME SOCKETS
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
  FILTER
  ====================================
  */

  const filteredNotifications =

    notifications.filter(

      (item) =>

        item.message
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        item.event_type
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /*
  ====================================
  COUNTERS
  ====================================
  */

  const approvals =
    notifications.filter(
      (n) =>
        n.event_type ===
        "APPROVAL"
    ).length;

  const rejections =
    notifications.filter(
      (n) =>
        n.event_type ===
        "REJECTION"
    ).length;

  const submissions =
    notifications.filter(
      (n) =>
        n.event_type ===
        "SUBMISSION"
    ).length;

  /*
  ====================================
  COLORS
  ====================================
  */

  const getColor =
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

  const getIcon =
    (type) => {

      switch (type) {

        case "APPROVAL":
          return "✅";

        case "REJECTION":
          return "❌";

        case "SUBMISSION":
          return "📨";

        case "SYSTEM":
          return "⚙️";

        default:
          return "🔔";
      }
    };

  return (

    <div style={pageStyle}>

      <h1 style={titleStyle}>
        Notifications Center
      </h1>

      {/* SUMMARY */}

      <div style={summaryGrid}>

        <div style={summaryCard}>
          <h4>Total</h4>
          <h1>
            {notifications.length}
          </h1>
        </div>

        <div style={summaryCard}>
          <h4>Approvals</h4>
          <h1>
            {approvals}
          </h1>
        </div>

        <div style={summaryCard}>
          <h4>Rejections</h4>
          <h1>
            {rejections}
          </h1>
        </div>

        <div style={summaryCard}>
          <h4>Submissions</h4>
          <h1>
            {submissions}
          </h1>
        </div>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search notifications..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={searchStyle}
      />

      {/* CONTENT */}

      {

        loading

          ?

          (

            <div style={emptyStyle}>
              Loading notifications...
            </div>

          )

          :

          filteredNotifications.length === 0

          ?

          (

            <div style={emptyStyle}>
              No notifications found
            </div>

          )

          :

          (

            <div style={feedContainer}>

              {

                filteredNotifications.map(
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
                        style={
                          cardHeader
                        }
                      >

                        <div>

                          <span
                            style={{
                              fontSize:
                                "22px",
                              marginRight:
                                "10px"
                            }}
                          >
                            {

                              getIcon(
                                notification.event_type
                              )

                            }
                          </span>

                          <span
                            style={{
                              ...badgeStyle,

                              backgroundColor:
                                getColor(
                                  notification.event_type
                                )
                            }}
                          >

                            {
                              notification.event_type
                            }

                          </span>

                        </div>

                        <span
                          style={
                            dateStyle
                          }
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
                        style={
                          messageStyle
                        }
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

  background: "#ffffff",

  borderRadius: "12px",

  padding: "20px",

  textAlign: "center",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const searchStyle = {

  width: "350px",

  padding: "10px",

  borderRadius: "8px",

  border:
    "1px solid #d1d5db",

  marginBottom: "20px"
};

const feedContainer = {

  maxHeight: "700px",

  overflowY: "auto"
};

const cardStyle = {

  background: "#ffffff",

  border:
    "1px solid #e5e7eb",

  borderRadius: "12px",

  padding: "18px",

  marginBottom: "15px",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const cardHeader = {

  display: "flex",

  justifyContent:
    "space-between",

  alignItems:
    "center",

  marginBottom: "12px"
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

const dateStyle = {

  color: "#64748b",

  fontSize: "12px"
};

const messageStyle = {

  fontSize: "15px",

  lineHeight: "1.6"
};

const emptyStyle = {

  background: "#ffffff",

  border:
    "1px solid #e5e7eb",

  borderRadius: "12px",

  padding: "40px",

  textAlign: "center",

  color: "#64748b"
};

export default Notifications;