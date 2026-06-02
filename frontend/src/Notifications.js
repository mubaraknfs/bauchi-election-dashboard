import React, {

  useEffect,
  useState

} from "react";

import { io }
from "socket.io-client";

/*
====================================
SOCKET
====================================
*/

const socket = io(
  "http://localhost:5000"
);

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

  /*
  ====================================
  REALTIME EVENTS
  ====================================
  */

  useEffect(() => {

    /*
    ====================================
    RESULT SUBMITTED
    ====================================
    */

    socket.on(

      "new_result_notification",

      (message) => {

        setNotifications(

          (prev) => [

            {

              type: "success",

              text: message,

              id: Date.now()
            },

            ...prev
          ]
        );
      }
    );

    /*
    ====================================
    RESULT APPROVED
    ====================================
    */

    socket.on(

      "approval_notification",

      (message) => {

        setNotifications(

          (prev) => [

            {

              type: "info",

              text: message,

              id: Date.now()
            },

            ...prev
          ]
        );
      }
    );

    /*
    ====================================
    RESULT REJECTED
    ====================================
    */

    socket.on(

      "rejection_notification",

      (message) => {

        setNotifications(

          (prev) => [

            {

              type: "error",

              text: message,

              id: Date.now()
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

  return (

    <div style={containerStyle}>

      <h2>
        Live Notifications
      </h2>

      {

        notifications.length === 0

        &&

        <p>
          No notifications yet
        </p>
      }

      {

        notifications.map(

          (notification) => (

            <div

              key={notification.id}

              style={{

                ...notificationStyle,

                backgroundColor:

                  notification.type === "success"

                    ? "#dcfce7"

                    :

                  notification.type === "info"

                    ? "#dbeafe"

                    :

                    "#fee2e2"
              }}
            >

              {
                notification.text
              }

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

const containerStyle = {

  border: "1px solid #ccc",

  borderRadius: "10px",

  padding: "20px",

  marginBottom: "20px",

  backgroundColor: "#fff"
};

const notificationStyle = {

  padding: "12px",

  borderRadius: "6px",

  marginBottom: "10px",

  fontWeight: "bold"
};

export default Notifications;