import React from "react";

import {

  MapContainer,
  TileLayer,
  Marker,
  Popup

} from "react-leaflet";

import L from "leaflet";

/*
====================================
CUSTOM GIS ICONS
====================================
*/

const redIcon = new L.Icon({

  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41]
});

const greenIcon = new L.Icon({

  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41]
});

const blueIcon = new L.Icon({

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41]
});

/*
====================================
FIX DEFAULT MARKER ICON
====================================
*/

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

/*
====================================
POLLING UNIT LOCATIONS
====================================
*/

const pollingLocations = [

  {
    id: 1,

    polling_unit:
      "Makama B Primary School",

    lat: 10.3158,

    lng: 9.8442
  },

  {
    id: 2,

    polling_unit:
      "Majidadi A Primary School",

    lat: 10.3100,

    lng: 9.8500
  }
];

function ElectionMap({

  results

}) {

  return (

    <div style={containerStyle}>

      <div style={headerStyle}>

        <h2 style={titleStyle}>
          Bauchi Election GIS Map
        </h2>

        <div style={legendStyle}>

          <div style={legendItemStyle}>
            🔴 Suspicious
          </div>

          <div style={legendItemStyle}>
            🟢 Normal
          </div>

          <div style={legendItemStyle}>
            🔵 No Result
          </div>

        </div>

      </div>

      <MapContainer

        center={[10.3158, 9.8442]}

        zoom={12}

        style={mapStyle}
      >

        <TileLayer

          attribution='&copy; OpenStreetMap contributors'

          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {

          pollingLocations.map((location) => {

            const result =
              results.find(

                (r) =>

                  r.polling_unit ===
                  location.polling_unit
              );

            /*
            ====================================
            TURNOUT ANALYTICS
            ====================================
            */

            let icon =
              blueIcon;

            let turnout = 0;

            if (result) {

              const registered =
                Number(
                  result.registered_card || 0
                );

              const accredited =
                Number(
                  result.accredited_card || 0
                );

              turnout =

                registered > 0

                  ?

                  (
                    accredited / registered
                  ) * 100

                  :

                  0;

              icon =

                turnout > 95

                  ?

                  redIcon

                  :

                  greenIcon;
            }

            return (

              <Marker

                key={location.id}

                position={[

                  location.lat,

                  location.lng
                ]}

                icon={icon}
              >

                <Popup>

                  <div style={popupStyle}>

                    <h3 style={popupTitleStyle}>

                      {location.polling_unit}

                    </h3>

                    {

                      result

                        ?

                        <>

                          <div style={popupRowStyle}>

                            <strong>
                              APC:
                            </strong>

                            {" "}

                            {result.apc}

                          </div>

                          <div style={popupRowStyle}>

                            <strong>
                              PDP:
                            </strong>

                            {" "}

                            {result.pdp}

                          </div>

                          <div style={popupRowStyle}>

                            <strong>
                              APM:
                            </strong>

                            {" "}

                            {result.apm}

                          </div>

                          <div style={popupRowStyle}>

                            <strong>
                              Turnout:
                            </strong>

                            {" "}

                            {turnout.toFixed(1)}%

                          </div>

                          <div style={popupRowStyle}>

                            <strong>
                              Status:
                            </strong>

                            {" "}

                            {

                              turnout > 95

                                ?

                                "⚠ Suspicious"

                                :

                                "✅ Normal"
                            }

                          </div>

                        </>

                        :

                        <div>

                          No results submitted yet

                        </div>
                    }

                  </div>

                </Popup>

              </Marker>
            );
          })
        }

      </MapContainer>

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

  padding: "20px",

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

  marginBottom: "15px",

  flexWrap: "wrap"
};

const titleStyle = {

  margin: 0
};

/*
====================================
LEGEND
====================================
*/

const legendStyle = {

  display: "flex",

  gap: "15px",

  fontWeight: "600",

  fontSize: "14px"
};

const legendItemStyle = {

  display: "flex",

  alignItems: "center",

  gap: "5px"
};

/*
====================================
MAP
====================================
*/

const mapStyle = {

  height: "550px",

  width: "100%",

  borderRadius: "10px"
};

/*
====================================
POPUP
====================================
*/

const popupStyle = {

  minWidth: "200px"
};

const popupTitleStyle = {

  marginBottom: "10px"
};

const popupRowStyle = {

  marginBottom: "6px"
};

export default ElectionMap;
