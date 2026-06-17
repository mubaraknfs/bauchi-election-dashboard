import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard-jjkdrh8lz.vercel.app";

function NotificationsDashboard() {

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const fetchNotifications =
    async () => {

      try {

        const response =
          await axios.get(

            `${API_URL}/api/notifications`
          );

        setNotifications(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  useEffect(() => {

    fetchNotifications();

    axios.put(

      `${API_URL}/api/notifications/read-all`
    );

  }, []);

  return (

    <div
      style={{
        padding: "20px"
      }}
    >

      <h1>
        Notifications Center
      </h1>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px"
        }}
      >

        {

          notifications.map(

            (item) => (

              <div

                key={item.id}

                style={{

                  borderBottom:
                    "1px solid #eee",

                  padding:
                    "12px 0"
                }}
              >

                <strong>

                  {
                    item.event_type
                  }

                </strong>

                <br />

                {
                  item.message
                }

                <br />

                <small>

                  {

                    new Date(
                      item.created_at
                    )

                    .toLocaleString()
                  }

                </small>

              </div>
            )
          )
        }

      </div>

    </div>
  );
}

export default NotificationsDashboard;