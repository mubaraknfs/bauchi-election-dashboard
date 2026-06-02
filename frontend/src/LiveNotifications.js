import React, {

  useEffect,
  useState

} from "react";

import { io } from "socket.io-client";

/*
====================================
SOCKET CONNECTION
====================================
*/

const socket =
  io("http://localhost:5000");

function LiveNotifications() {

  const [

    notifications,

    setNotifications

  ] = useState([]);

  /*
  ====================================
  SOCKET LISTENER
  ====================================
  */

  useEffect(() => {

    socket.on(

      "notification",

      (data) => {

        setNotifications(

          (prev) => [

            data,

            ...prev
          ]
        );
      }
    );

    return () => {

      socket.off(
        "notification"
      );
    };

  }, []);

  return (

    <div style={cardStyle}>

      <h2>
        Live Notifications
      </h2>

      {

        notifications.length === 0

          ?

          <p>
            No notifications yet
          </p>

          :

          notifications.map(

            (note, index) => (

              <div

                key={index}

                style={notificationStyle}
              >

                🔔 {note.message}

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

const cardStyle = {

  border: "1px solid #ccc",

  borderRadius: "10px",

  padding: "20px",

  marginBottom: "20px",

  backgroundColor: "#fff"
};

const notificationStyle = {

  padding: "10px",

  borderBottom:
    "1px solid #eee"
};

export default LiveNotifications;