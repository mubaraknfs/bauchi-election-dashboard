import React from "react";

function FraudDetection({

  results

}) {

  /*
  ====================================
  DETECT SUSPICIOUS RESULTS
  ====================================
  */

  const suspicious =
    results.filter((row) => {

      const registered =
        Number(row.registered_card || 0);

      const accredited =
        Number(row.accredited_card || 0);

      const turnout =

        registered > 0

          ?

          (accredited / registered) * 100

          :

          0;

      return turnout > 95;
    });

  return (

    <div style={containerStyle}>

      <div style={headerStyle}>

        <h2 style={titleStyle}>
          Suspicious Polling Units
        </h2>

        <span style={badgeStyle}>

          {suspicious.length}

          {" "}

          Alert(s)

        </span>

      </div>

      {

        suspicious.length === 0

          ?

          <div style={safeStyle}>

            ✅ No suspicious activity detected

          </div>

          :

          suspicious.map((item) => {

            const registered =
              Number(item.registered_card || 0);

            const accredited =
              Number(item.accredited_card || 0);

            const turnout =

              registered > 0

                ?

                (
                  (accredited / registered) * 100
                ).toFixed(1)

                :

                0;

            return (

              <div

                key={item.id}

                style={alertStyle}
              >

                <div style={alertTopStyle}>

                  <span style={warningIconStyle}>
                    ⚠
                  </span>

                  <strong style={puStyle}>

                    {item.polling_unit}

                  </strong>

                </div>

                <div style={detailsStyle}>

                  High turnout detected

                  {" • "}

                  Turnout:

                  {" "}

                  <strong>
                    {turnout}%
                  </strong>

                </div>

              </div>
            );
          })
      }

    </div>
  );
}

/*
====================================
MAIN CONTAINER
====================================
*/

const containerStyle = {

  backgroundColor: "#ffffff",

  padding: "25px",

  marginTop: "30px",

  borderRadius: "12px",

  border: "1px solid #dcdcdc",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

/*
====================================
HEADER
====================================
*/

const headerStyle = {

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  marginBottom: "20px"
};

const titleStyle = {

  margin: 0,

  fontSize: "24px",

  fontWeight: "700"
};

const badgeStyle = {

  backgroundColor: "#ff4d4f",

  color: "#ffffff",

  padding: "6px 12px",

  borderRadius: "20px",

  fontWeight: "bold",

  fontSize: "14px"
};

/*
====================================
SAFE STATE
====================================
*/

const safeStyle = {

  backgroundColor: "#f6ffed",

  border: "1px solid #b7eb8f",

  color: "#389e0d",

  padding: "15px",

  borderRadius: "8px",

  fontWeight: "500"
};

/*
====================================
ALERT CARD
====================================
*/

const alertStyle = {

  backgroundColor: "#fff1f0",

  border: "1px solid #ffa39e",

  borderLeft: "6px solid #ff4d4f",

  padding: "15px",

  marginBottom: "15px",

  borderRadius: "8px"
};

const alertTopStyle = {

  display: "flex",

  alignItems: "center",

  gap: "10px",

  marginBottom: "8px"
};

const warningIconStyle = {

  fontSize: "22px"
};

const puStyle = {

  fontSize: "18px"
};

const detailsStyle = {

  color: "#595959",

  fontSize: "15px"
};

export default FraudDetection;
