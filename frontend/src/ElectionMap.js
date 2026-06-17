import React, { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle
} from "react-leaflet";

import L from "leaflet";

import partyConfig from "./config/partyConfig";

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

  const [filterType, setFilterType] =
    useState("all"); // all, suspicious, normal, no-result

  const [showHeatmap, setShowHeatmap] =
    useState(false);

  const filteredLocations =
    lgaLocations.filter(
      (location) => {
        const matchesSearch =
          location.lga
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

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

        const registered =
          result
            ? Number(
                result.total_registered_voters || 0
              )
            : 0;

        const accredited =
          result
            ? Number(
                result.total_accredited_voters || 0
              )
            : 0;

        const turnout =
          registered > 0
            ? (accredited / registered) * 100
            : 0;

        const isSuspicious =
          registered > 0 &&
          turnout > 95;

        if (!matchesSearch)
          return false;

        if (filterType === "suspicious")
          return isSuspicious && result;
        if (filterType === "normal")
          return !isSuspicious && result;
        if (filterType === "no-result")
          return !result;
        return true;
      }
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

        <div style={controlsContainerStyle}>
          <div style={filterButtonsStyle}>
            <button
              onClick={() => setFilterType("all")}
              style={{
                ...filterButtonStyle,
                background: filterType === "all" ? "#1890ff" : "#f0f0f0",
                color: filterType === "all" ? "#fff" : "#333"
              }}
            >
              All ({lgaLocations.length})
            </button>
            <button
              onClick={() => setFilterType("normal")}
              style={{
                ...filterButtonStyle,
                background: filterType === "normal" ? "#52c41a" : "#f0f0f0",
                color: filterType === "normal" ? "#fff" : "#333"
              }}
            >
              ✓ Normal ({lgaSummaries.filter(r => {
                const reg = Number(r.total_registered_voters || 0);
                const acc = Number(r.total_accredited_voters || 0);
                const turnout = reg > 0 ? (acc/reg)*100 : 0;
                return turnout <= 95;
              }).length})
            </button>
            <button
              onClick={() => setFilterType("suspicious")}
              style={{
                ...filterButtonStyle,
                background: filterType === "suspicious" ? "#ff4d4f" : "#f0f0f0",
                color: filterType === "suspicious" ? "#fff" : "#333"
              }}
            >
              ⚠ Suspicious ({lgaSummaries.filter(r => {
                const reg = Number(r.total_registered_voters || 0);
                const acc = Number(r.total_accredited_voters || 0);
                return reg > 0 && (acc/reg)*100 > 95;
              }).length})
            </button>
            <button
              onClick={() => setFilterType("no-result")}
              style={{
                ...filterButtonStyle,
                background: filterType === "no-result" ? "#faad14" : "#f0f0f0",
                color: filterType === "no-result" ? "#fff" : "#333"
              }}
            >
              ✗ No Result ({lgaLocations.length - lgaSummaries.length})
            </button>
          </div>
          <label style={heatmapToggleStyle}>
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
            />
            Show Heatmap
          </label>
        </div>

        <div style={legendStyle}>

          <div style={legendItemStyle}>
            🔴 Suspicious (&gt;95%)
          </div>

          <div style={legendItemStyle}>
            🟢 Normal (≤95%)
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
              "#ecfdf5",
            borderLeft: "4px solid #52c41a"
          }}
        >
          <h2>
            {results.length}
          </h2>
          <p>
            Results Submitted
          </p>
          <small style={{ color: "#666" }}>
            {Math.round((results.length / lgaLocations.length) * 100)}% Complete
          </small>
        </div>

        <div
          style={{
            ...statsCard,
            background:
              "#fef2f2",
            borderLeft: "4px solid #ff4d4f"
          }}
        >
          <h2>
            {cancelledCount}
          </h2>
          <p>
            Cancelled
          </p>
          <small style={{ color: "#666" }}>
            {Math.round((cancelledCount / results.length) * 100 || 0)}% of Results
          </small>
        </div>

        <div
          style={{
            ...statsCard,
            background:
              "#fff7ed",
            borderLeft: "4px solid #ff7a45"
          }}
        >
          <h2>
            {suspiciousCount}
          </h2>
          <p>
            Suspicious Turnout
          </p>
          <small style={{ color: "#666" }}>
            {Math.round((suspiciousCount / results.length) * 100 || 0)}% Flagged
          </small>
        </div>

        <div
          style={{
            ...statsCard,
            background:
              "#eff6ff",
            borderLeft: "4px solid #1890ff"
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
            Pending Submission
          </p>
          <small style={{ color: "#666" }}>
            Awaiting data
          </small>
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

        {showHeatmap &&
          filteredLocations.map((location) => {
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

            if (!result) return null;

            const registered =
              Number(
                result.total_registered_voters || 0
              );

            const accredited =
              Number(
                result.total_accredited_voters || 0
              );

            const turnout =
              registered > 0
                ? (accredited / registered) * 100
                : 0;

            const intensity =
              Math.min(turnout / 100, 1);
            const radius =
              10 + intensity * 20;
            const color =
              turnout > 95
                ? "#ff4d4f"
                : "#52c41a";

            return (
              <Circle
                key={`heatmap-${location.lga}`}
                center={[location.lat, location.lng]}
                radius={radius * 100}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.3,
                  weight: 2
                }}
              />
            );
          })}

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
              let leadingParty = null;

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

                // Find leading party
                leadingParty =
                  Object.entries(result)
                    .filter(([key]) =>
                      [
                        "aac", "adc", "adp", "apc",
                        "apga", "apm", "app", "bp",
                        "lp", "ndc", "nnpp", "nrm",
                        "pdp", "prp", "sdp", "ypp",
                        "zlp"
                      ].includes(key)
                    )
                    .sort(
                      (a, b) =>
                        Number(b[1]) -
                        Number(a[1])
                    )[0];

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
            <strong>Registered:</strong> {result.total_registered_voters || 0}
          </div>

          <div style={popupRowStyle}>
            <strong>Accredited:</strong> {result.total_accredited_voters || 0}
          </div>

          <div style={popupRowStyle}>
            <strong>Turnout:</strong> <span style={{ color: turnout > 95 ? "#ff4d4f" : "#52c41a", fontWeight: "bold" }}>
              {turnout.toFixed(1)}%
            </span>
          </div>

          <div style={popupRowStyle}>
            <strong>Status:</strong> {
              turnout > 95
                ? "⚠ Suspicious"
                : "✅ Normal"
            }
          </div>

          <hr />

          <div style={popupRowStyle}>
            <strong>Votes Cast:</strong> {result.total_votes_cast || 0}
          </div>

          <div style={popupRowStyle}>
            <strong>Valid Votes:</strong> {result.total_valid_votes || 0}
          </div>

          <div style={popupRowStyle}>
            <strong>Polling Units:</strong> {result.polling_units_reported || 0}
          </div>

          <hr />

          {leadingParty && (
            <div style={popupRowStyle}>
              <strong>Leading Party:</strong>{" "}
              <span style={{
                color: partyConfig[leadingParty[0]]?.color || "#000",
                fontWeight: "bold"
              }}>
                {partyConfig[leadingParty[0]]?.name || leadingParty[0].toUpperCase()}
              </span>
              <br />
              <span style={{ fontSize: "12px", color: "#666" }}>
                {leadingParty[1]} votes
              </span>
            </div>
          )}

          <hr />

          <div style={partyResultsStyle}>
            {Object.entries(result)
              .filter(([key]) =>
                [
                  "aac", "adc", "adp", "apc",
                  "apga", "apm", "app", "bp",
                  "lp", "ndc", "nnpp", "nrm",
                  "pdp", "prp", "sdp", "ypp",
                  "zlp"
                ].includes(key)
              )
              .sort((a, b) => Number(b[1]) - Number(a[1]))
              .map(([party, votes]) => (
                <div key={party} style={partyResultItemStyle}>
                  <span style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    backgroundColor: partyConfig[party]?.color || "#ccc",
                    borderRadius: "3px",
                    marginRight: "6px",
                    verticalAlign: "middle"
                  }}></span>
                  <strong>{partyConfig[party]?.name || party.toUpperCase()}:</strong> {votes}
                </div>
              ))}
          </div>

        </>

      ) : (

        <div style={{ color: "#999" }}>
          ⏳ No results submitted yet
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

const controlsContainerStyle = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
  flexWrap: "wrap"
};

const filterButtonsStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap"
};

const filterButtonStyle = {
  padding: "8px 12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  transition: "all 0.3s ease",
  whiteSpace: "nowrap"
};

const heatmapToggleStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500"
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
  justifyContent: "flex-start",
  alignItems: "center",
  marginBottom: "15px",
  flexWrap: "wrap",
  gap: "15px"
};

const titleStyle = {
  margin: 0,
  fontSize: "20px",
  whiteSpace: "nowrap"
};

const legendStyle = {
  display: "flex",
  gap: "15px",
  fontWeight: "600",
  fontSize: "13px",
  whiteSpace: "nowrap"
};

const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "5px"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(200px,1fr))",
  gap: "12px",
  marginBottom: "20px"
};

const statsCard = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "15px",
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

  minWidth: "320px",

  maxHeight: "500px",

  overflowY: "auto"

};

const popupTitleStyle = {
  marginBottom: "10px",
  fontSize: "16px"
};

const popupRowStyle = {
  marginBottom: "8px",
  fontSize: "13px"
};

const partyResultsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  marginTop: "8px"
};

const partyResultItemStyle = {
  fontSize: "12px",
  padding: "6px 8px",
  backgroundColor: "#f5f5f5",
  borderRadius: "4px"
};

export default ElectionMap;