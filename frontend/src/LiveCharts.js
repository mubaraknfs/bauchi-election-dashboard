import React from "react";

import {

  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer

} from "recharts";

function LiveCharts({

  stateSummary

}) {

  /*
  ====================================
  CHART DATA
  ====================================
  */

  const data = [

    {
      party: "AAC",
      votes:
        Number(stateSummary?.aac || 0)
    },

    {
      party: "ADC",
      votes:
        Number(stateSummary?.adc || 0)
    },

    {
      party: "APC",
      votes:
        Number(stateSummary?.apc || 0)
    },

    {
      party: "APM",
      votes:
        Number(stateSummary?.apm || 0)
    },

    {
      party: "LP",
      votes:
        Number(stateSummary?.lp || 0)
    },

    {
      party: "NDC",
      votes:
        Number(stateSummary?.ndc || 0)
    },

    {
      party: "PDP",
      votes:
        Number(stateSummary?.pdp || 0)
    }
  ];

  return (

    <div style={containerStyle}>

      <h2>
        Live State Election Analytics
      </h2>

      <ResponsiveContainer

        width="100%"

        height={400}
      >

        <BarChart
          data={data}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="party"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="votes"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

/*
====================================
STYLES
====================================
*/

const containerStyle = {

  backgroundColor: "#fff",

  padding: "20px",

  borderRadius: "10px",

  marginTop: "30px",

  border: "1px solid #ccc"
};

export default LiveCharts;