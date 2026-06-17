import React, { useState } from "react";

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

const lgaLocations = [

  {
    lga: "Bauchi",
    lat: 10.3158,
    lng: 9.8442
  },

  {
    lga: "Katagum",
    lat: 10.2865,
    lng: 10.3500
  },

  {
    lga: "Misau",
    lat: 11.3137,
    lng: 10.4664
  },

  {
    lga: "Ningi",
    lat: 11.0786,
    lng: 9.5680
  },

  {
    lga: "Toro",
    lat: 10.0580,
    lng: 9.0660
  },

  {
    lga: "Darazo",
    lat: 10.9990,
    lng: 10.4100
  },

  {
    lga: "Ganjuwa",
    lat: 10.3300,
    lng: 9.8200
  },

  {
    lga: "Tafawa Balewa",
    lat: 9.8000,
    lng: 9.5200
  },

  {
    lga: "Bogoro",
    lat: 9.6500,
    lng: 9.6200
  },

  {
    lga: "Dass",
    lat: 10.0000,
    lng: 9.5200
  },

  {
    lga: "Warji",
    lat: 11.1500,
    lng: 9.7500
  },

  {
    lga: "Jama'are",
    lat: 11.6700,
    lng: 9.9200
  },

  {
    lga: "Shira",
    lat: 10.5300,
    lng: 10.2300
  },

  {
    lga: "Giade",
    lat: 11.3900,
    lng: 10.3000
  }

];

function ElectionMap({
  lgaSummaries = [],
  results = []
}) {

  const [search, setSearch] =
    useState("");

  const filteredLocations =
    lgaLocations.filter(
      (location) =>
        location.lga
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const suspiciousCount =
    results.filter((r) => {

      const registered =
        Number(
          r.registered_card || 0
        );

      const accredited =
        Number(
          r.accredited_card || 0
        );

      return (
        registered > 0 &&
        (
          accredited /
          registered
        ) * 100 > 95
      );

    }).length;

  const cancelledCount =
    results.filter(
      (r) =>
        Number(
          r.cancelled || 0
        ) === 1
    ).length;

  const noResultCount =
  lgaLocations.length -
  lgaSummaries.length;

  return (

    <div style={containerStyle}>

      <div style={headerStyle}>

        <h2 style={titleStyle}>
          Bauchi Election GIS Map
        </h2>

        <input
          type="text"
          placeholder="Search LGA..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={searchStyle}
        />

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

      <div style={statsGrid}>

        <div
          style={{
            ...statsCard,
            background:
              "#ecfdf5"
          }}
        >
          <h2>
            {results.length}
          </h2>
          <p>
            Results Submitted
          </p>
        </div>

        <div
          style={{
            ...statsCard,
            background:
              "#fef2f2"
          }}
        >
          <h2>
            {cancelledCount}
          </h2>
          <p>
            Cancelled
          </p>
        </div>

        <div
          style={{
            ...statsCard,
            background:
              "#fff7ed"
          }}
        >
          <h2>
            {suspiciousCount}
          </h2>
          <p>
            Suspicious Turnout
          </p>
        </div>

        <div
          style={{
            ...statsCard,
            background:
              "#eff6ff"
          }}
        >
          <h2>
  {
    Math.max(
      0,
      noResultCount
    )
  }
</h2>
          <p>
            No Result
          </p>
        </div>

      </div>

      <MapContainer
  center={[
    10.95,
    10.10
  ]}
  zoom={8}
  style={mapStyle}
>

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {
          filteredLocations.map(
            (location) => {

              const result =
                lgaSummaries.find(
                  (lga) =>

                    lga.lga_name
                      ?.toLowerCase()
                      .trim() ===

                    location.lga
                      .toLowerCase()
                      .trim()
                );

              let icon =
                blueIcon;

              let turnout = 0;

              if (result) {

                const registered =
  Number(
    result.total_registered_voters || 0
  );

const accredited =
  Number(
    result.total_accredited_voters || 0
  );

                turnout =
                  registered > 0
                    ? (
                        accredited /
                        registered
                      ) * 100
                    : 0;

                icon =
                  turnout > 95
                    ? redIcon
                    : greenIcon;

              }

              return (

                <Marker
                  key={
                    location.lga
                  }
                  position={[
                    location.lat,
                    location.lng
                  ]}
                  icon={icon}
                >

                  <Popup>

  <div style={popupStyle}>

    <h3 style={popupTitleStyle}>
      {location.lga} LGA
    </h3>

    {

      result ? (

        <>

          <div style={popupRowStyle}>
            <strong>
              Registered:
            </strong>{" "}
            {
              result.total_registered_voters || 0
            }
          </div>

          <div style={popupRowStyle}>
            <strong>
              Accredited:
            </strong>{" "}
            {
              result.total_accredited_voters || 0
            }
          </div>

          <div style={popupRowStyle}>
            <strong>
              Votes Cast:
            </strong>{" "}
            {
              result.total_votes_cast || 0
            }
          </div>

          <div style={popupRowStyle}>
            <strong>
              Valid Votes:
            </strong>{" "}
            {
              result.total_valid_votes || 0
            }
          </div>

          <div style={popupRowStyle}>
            <strong>
              Polling Units Reported:
            </strong>{" "}
            {
              result.polling_units_reported || 0
            }
          </div>

          <hr />

          <div style={popupRowStyle}>
            <strong>
              Leading Party:
            </strong>{" "}
            {
              result.leading_party || "-"
            }
          </div>

          <hr />

          {

            Object.entries(result)

              .filter(
                ([key]) =>

                  [

                    "aac",
                    "adc",
                    "adp",
                    "apc",
                    "apga",
                    "apm",
                    "app",
                    "bp",
                    "lp",
                    "ndc",
                    "nnpp",
                    "nrm",
                    "pdp",
                    "prp",
                    "sdp",
                    "ypp",
                    "zlp"

                  ].includes(key)
              )

              .sort(
                (a, b) =>

                  Number(b[1]) -

                  Number(a[1])
              )

              .map(
                ([party, votes]) => (

                  <div
                    key={party}
                    style={popupRowStyle}
                  >

                    <strong>
                      {
                        party.toUpperCase()
                      }
                      :
                    </strong>{" "}

                    {votes}

                  </div>

                )
              )
          }

          <hr />

          <div style={popupRowStyle}>

            <strong>
              Turnout:
            </strong>{" "}

            {
              turnout.toFixed(1)
            }%

          </div>

          <div style={popupRowStyle}>

            <strong>
              Status:
            </strong>{" "}

            {

              turnout > 95

                ? "⚠ Suspicious"

                : "✅ Normal"

            }

          </div>

        </>

      ) : (

        <div>

          No results submitted yet

        </div>

      )

    }

  </div>

</Popup>

                </Marker>

              );
            }
          )
        }

      </MapContainer>

    </div>

  );
}

const searchStyle = {
  width: "300px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const containerStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  marginTop: "30px",
  borderRadius: "12px",
  border: "1px solid #dcdcdc",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
  flexWrap: "wrap",
  gap: "15px"
};

const titleStyle = {
  margin: 0
};

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

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "15px",
  marginBottom: "20px"
};

const statsCard = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const mapStyle = {
  height: "550px",
  width: "100%",
  borderRadius: "10px"
};

const popupStyle = {

  minWidth: "260px",

  maxHeight: "400px",

  overflowY: "auto"

};

const popupTitleStyle = {
  marginBottom: "10px"
};

const popupRowStyle = {
  marginBottom: "6px"
};

export default ElectionMap;