import React from "react";

function LiveNotifications({

  notifications = []

}) {

  return (

    <div style={cardStyle}>

      <h2>
        Live Notifications
      </h2>

      {

        notifications.length === 0

        ? (

          <p>
            No notifications yet
          </p>

        ) : (

          notifications.map((item, index) => (

            <div

              key={index}

              style={notificationStyle}
            >

              <strong>
                {item.type?.toUpperCase()}
              </strong>

              <p>
                {item.message}
              </p>

            </div>
          ))
        )
      }

    </div>
  );
}

const cardStyle = {

  border: "1px solid #ccc",

  borderRadius: "10px",

  padding: "20px",

  marginBottom: "20px",

  backgroundColor: "#fff"
};

const notificationStyle = {

  borderBottom: "1px solid #eee",

  padding: "10px 0"
};

export default LiveNotifications;