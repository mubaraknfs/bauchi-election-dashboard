import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

  const cancellationReasons = [

  "Over-voting",

  "Violence at the polling unit",

  "Ballot box snatching",

  "Destruction of election materials",

  "Theft or loss of election materials",

  "Disruption of voting by thugs or unauthorized persons",

  "Failure to conduct voting",

  "Serious BVAS accreditation irregularities",

  "Voting without proper accreditation",

  "Falsification or manipulation of results",

  "Discrepancies in result figures",

  "Non-compliance with INEC guidelines and electoral procedures",

  "Security threats preventing voting or counting",

  "Natural disasters or emergencies affecting the election process",

  "Compromised integrity of the election process",

  "Unauthorized cancellation, alteration, or mutilation of result sheets",

  "Multiple voting or other significant electoral malpractices",

  "Intimidation or coercion of voters and election officials",

  "Court orders affecting the conduct of voting in the polling unit",

  "Any irregularity that substantially affects the credibility of the election at the polling unit"
];

function ResultSubmission() {

  const [lgas, setLgas] = useState([]);
  const [wards, setWards] = useState([]);
  const [pollingUnits, setPollingUnits] = useState([]);
  const [isCancelled, setIsCancelled] =
  useState(false);

  const [formData, setFormData] = useState({

  lga_id: "",
  ward_id: "",
  ward: "",
  polling_unit: "",

  cancelled: false,

  cancellation_reason: "",

  cancellation_comment: "",

  registered_card: "",
  accredited_card: "",
  total_vote_cast: "",
  total_vote_rejected: "",
  valid_vote: "",

  party_agent: "",
  phone_number: "",
  presiding_officer: "",

  aac: "",
  adc: "",
  adp: "",
  apc: "",
  apga: "",
  apm: "",
  app: "",
  bp: "",
  lp: "",
  ndc: "",
  nnpp: "",
  nrm: "",
  pdp: "",
  prp: "",
  sdp: "",
  ypp: "",
  zlp: ""
});

  useEffect(() => {

    fetchLgas();

  }, []);

  const fetchLgas = async () => {

    try {

      const response =
        await axios.get(
          `${API_URL}/api/lgas`
        );

      console.log(
        "LGAS:",
        response.data
      );

      setLgas(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  const fetchWards = async (lgaId) => {

    try {

      const response =
        await axios.get(
          `${API_URL}/api/wards-by-lga/${lgaId}`
        );

      console.log(
        "WARDS:",
        response.data
      );

      setWards(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  const fetchPollingUnits =
    async (wardId) => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/polling-units/${wardId}`
          );

        console.log(
          "POLLING UNITS:",
          response.data
        );

        setPollingUnits(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value
    });
  };

  const handleLgaChange =
    async (e) => {

      const lgaId =
        e.target.value;

      setFormData({

        ...formData,

        lga_id: lgaId,

        ward_id: "",
        ward: "",
        polling_unit: ""
      });

      setWards([]);
      setPollingUnits([]);

      if (lgaId) {

        await fetchWards(
          lgaId
        );
      }
    };

  const handleWardChange =
    async (e) => {

      const wardId =
        e.target.value;

      const selectedWard =
        wards.find(

          (ward) =>

            String(
              ward.ward_id
            ) ===

            String(
              wardId
            )
        );

      setFormData({

        ...formData,

        ward_id: wardId,

        ward:
          selectedWard
            ? selectedWard.ward_name
            : "",

        polling_unit: ""
      });

      setPollingUnits([]);

      if (wardId) {

        await fetchPollingUnits(
          wardId
        );
      }
    };

  const submitResult =
  async () => {

    try {

      /*
      ====================================
      CANCELLED POLLING UNIT VALIDATION
      ====================================
      */

      if (isCancelled) {

        if (

          !formData.cancellation_reason ||

          !formData.party_agent ||

          !formData.phone_number

        ) {

          alert(
            "Cancellation reason, party agent and phone number are required"
          );

          return;
        }
      }

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.post(

          `${API_URL}/submit-result`,

          formData,

          {

            headers: {

              Authorization:
                `Bearer ${token}`
            }
          }
        );

      alert(
        response.data.message
      );

    } catch (error) {

      console.error(error);

      alert(

        error.response?.data?.message ||

        "Failed to submit result"
      );
    }
  };

  return (

    <div style={containerStyle}>

      <h1>
        Election Result Submission
      </h1>

      <div style={cardStyle}>

        <h2>
          Polling Unit Information
        </h2>

        <select
          style={inputStyle}
          value={formData.lga_id}
          onChange={handleLgaChange}
        >

          <option value="">
            Select LGA
          </option>

          {lgas.map((lga) => (

            <option
              key={lga.lga_id}
              value={lga.lga_id}
            >
              {lga.lga_name}
            </option>

          ))}

        </select>

        <select
          style={inputStyle}
          value={formData.ward_id}
          onChange={handleWardChange}
        >

          <option value="">
            Select Ward
          </option>

          {wards.map((ward) => (

            <option
              key={ward.ward_id}
              value={ward.ward_id}
            >
              {ward.ward_name}
            </option>

          ))}

        </select>

        <select
          style={inputStyle}
          value={formData.polling_unit}
          onChange={(e) =>
            setFormData({

              ...formData,

              polling_unit:
                e.target.value
            })
          }
        >

          <option value="">
            Select Polling Unit
          </option>

          {pollingUnits.map((unit) => (

            <option
              key={
                unit.polling_unit_id
              }
              value={
                unit.polling_unit_name
              }
            >

              {
                unit.polling_unit_code
              }

              {" - "}

              {
                unit.polling_unit_name
              }

            </option>

          ))}

        </select>

<div
  style={{
    marginTop: "15px",
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#fff8dc",
    border: "1px solid orange",
    borderRadius: "6px"
  }}
>

  <label
    style={{
      fontWeight: "bold"
    }}
  >

    <input

      type="checkbox"

      checked={isCancelled}

      onChange={(e) => {

        const checked =
          e.target.checked;

        setIsCancelled(
          checked
        );

        setFormData({

          ...formData,

          cancelled:
            checked
        });
      }}

      style={{
        marginRight: "10px"
      }}
    />

    Election Cancelled At Polling Unit

  </label>

</div>

{
  isCancelled && (

    <div
      style={{
        backgroundColor:
          "#fee2e2",

        border:
          "1px solid #dc2626",

        padding: "15px",

        borderRadius: "6px",

        marginBottom: "20px"
      }}
    >

      <strong>

        Polling Unit Result Cancelled

      </strong>

      <p>

        Party vote entry has been disabled.

      </p>

    </div>

  )
}

{
  isCancelled && (

    <>

      <select

        name="cancellation_reason"

        value={
          formData.cancellation_reason
        }

        onChange={handleChange}

        style={inputStyle}
      >

        <option value="">
          Select Cancellation Reason
        </option>

        {
          cancellationReasons.map(
            (reason) => (

              <option
                key={reason}
                value={reason}
              >
                {reason}
              </option>
            )
          )
        }

      </select>

      <textarea

        rows="5"

        name="cancellation_comment"

        placeholder="Detailed comment"

        value={
          formData.cancellation_comment
        }

        onChange={handleChange}

        style={inputStyle}
      />

    </>

  )
}
        <input
        type="number"
        name="registered_card"
        placeholder="Registered Card"
        style={inputStyle}
        value={formData.registered_card}
        onChange={handleChange}
        disabled={isCancelled}
      />

        <input
          type="number"
          name="accredited_card"
          placeholder="Accredited Card"
          style={inputStyle}
          value={formData.accredited_card}
          onChange={handleChange}
          disabled={isCancelled}
        />

        <input
          type="number"
          name="total_vote_cast"
          placeholder="Total Vote Cast"
          style={inputStyle}
          value={formData.total_vote_cast}
          onChange={handleChange}
          disabled={isCancelled}
        />

        <input
          type="number"
          name="total_vote_rejected"
          placeholder="Rejected Votes"
          style={inputStyle}
          value={formData.total_vote_rejected}
          onChange={handleChange}
          disabled={isCancelled}
        />

        <input
          type="number"
          name="valid_vote"
          placeholder="Valid Votes"
          style={inputStyle}
          value={formData.valid_vote}
          onChange={handleChange}
          disabled={isCancelled}
        />

        {
  !isCancelled && (

    <>

      <h2>
        Party Votes
      </h2>

      <div style={partyGridStyle}>
          {[
            "AAC","ADC","ADP","APC","APGA",
            "APM","APP","BP","LP","NDC",
            "NNPP","NRM","PDP","PRP",
            "SDP","YPP","ZLP"
          ].map((party) => (

            <div
              key={party}
              style={partyCardStyle}
            >

              <strong>
                {party}
              </strong>

              <input
                type="number"
                name={party.toLowerCase()}
                placeholder={`${party} Votes`}
                style={inputStyle}
                value={
                  formData[
                    party.toLowerCase()
                  ]
                }
                onChange={handleChange}
              />

            </div>

           ))}

      </div>

    </>

  )
}

        <input
          type="text"
          name="party_agent"
          placeholder="Party Agent"
          style={inputStyle}
          value={formData.party_agent}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          style={inputStyle}
          value={formData.phone_number}
          onChange={handleChange}
        />

        <input
          type="text"
          name="presiding_officer"
          placeholder="Presiding Officer"
          style={inputStyle}
          value={formData.presiding_officer}
          onChange={handleChange}
          disabled={isCancelled}
        />

        <button
          style={buttonStyle}
          onClick={submitResult}
        >

          Submit Result

        </button>

      </div>

    </div>
  );
}

const containerStyle = {
  padding: "20px"
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #ddd"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxSizing: "border-box"
};

const partyGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(180px,1fr))",
  gap: "10px"
};

const partyCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default ResultSubmission;