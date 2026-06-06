const rateLimit =
  require("express-rate-limit");
const helmet =
  require("helmet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { Pool } = require("pg");

const auth =
  require("./middleware/auth");

const authorizeRoles =
  require("./middleware/roles");

dotenv.config();

const app = express();

/*
====================================
CORS
====================================
*/

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://bauchi-election-dashboard.vercel.app"
    ],
    credentials: true
  })
);

app.use(helmet());

app.use(express.json());

/*
====================================
RATE LIMITER
====================================
*/

const limiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 1000
  });

app.use("/api/login", limiter);

/*
====================================
HTTP + SOCKET.IO
====================================
*/

const http = require("http");

const server =
  http.createServer(app);

const { Server } =
  require("socket.io");

const io = new Server(server, {

  cors: {

    origin:
      [
        "http://localhost:3000",
        "https://bauchi-election-dashboard.vercel.app"
      ],

    methods:
      ["GET", "POST"],

    credentials: true
  }
});

/*
====================================
DATABASE CONNECTION
====================================
*/

const pool = new Pool({

  connectionString:
    process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false
  }
});

/*
====================================
AUDIT LOGGER
====================================
*/

async function createAuditLog(

  user_id,
  user_role,
  action_type,
  action_description

) {

  try {

    await pool.query(

      `

      INSERT INTO audit_logs (

        user_id,
        user_role,
        action_type,
        action_description

      )

      VALUES (

        $1,$2,$3,$4

      )

      `,

      [

        user_id,
        user_role,
        action_type,
        action_description
      ]
    );

  } catch (error) {

    console.error(

      "Audit Log Error:",

      error
    );
  }
}

/*
====================================
NOTIFICATION LOGGER
====================================
*/

async function createNotification(
  eventType,
  message
) {

  try {

    await pool.query(

      `
      INSERT INTO notifications
      (
        event_type,
        message
      )
      VALUES
      ($1,$2)
      `,

      [
        eventType,
        message
      ]
    );

  } catch (error) {

    console.error(
      "Notification Error:",
      error
    );
  }
}

/*
====================================
HELPER FUNCTION
====================================
*/

function detectLeadingParty(row) {

  const parties = {

    AAC: Number(row.aac || 0),
    ADC: Number(row.adc || 0),
    ADP: Number(row.adp || 0),
    APC: Number(row.apc || 0),
    APGA: Number(row.apga || 0),
    APM: Number(row.apm || 0),
    APP: Number(row.app || 0),
    BP: Number(row.bp || 0),
    LP: Number(row.lp || 0),
    NDC: Number(row.ndc || 0),
    NNPP: Number(row.nnpp || 0),
    NRM: Number(row.nrm || 0),
    PDP: Number(row.pdp || 0),
    PRP: Number(row.prp || 0),
    SDP: Number(row.sdp || 0),
    YPP: Number(row.ypp || 0),
    ZLP: Number(row.zlp || 0)
  };

  let winningParty = "";

  let maxVotes = -1;

  Object.entries(parties).forEach(

    ([party, votes]) => {

      if (votes > maxVotes) {

        maxVotes = votes;

        winningParty = party;
      }
    }
  );

  return {

    leading_party:
      winningParty,

    leading_votes:
      maxVotes
  };
}

/*
====================================
TEST ROUTE
====================================
*/

app.get("/", (req, res) => {

  res.send(
    "Election Server Running"
  );
});

app.get("/db-test", async (req, res) => {

  try {

    const result =
      await pool.query(
        "SELECT NOW()"
      );

    res.json({

      success: true,

      time: result.rows[0]
    });

  } catch (error) {

    console.error(
      "DB TEST ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
});

app.get("/test-password", async (req, res) => {

  const hash =
    "$2b$10$3GIPU4LT7pbHwt0JFM1e9OKi3kCNYgUpeqGG6mPfumA3XtcmONRfa";

  const match =
    await bcrypt.compare(
      "admin123",
      hash
    );

  res.json({
    match
  });
});

app.post("/debug-login", async (req, res) => {

  try {

    const { email, password } = req.body;

    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    const userResult =
      await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

    console.log(
      "USER FOUND:",
      userResult.rows.length
    );

    if (userResult.rows.length === 0) {

      return res.json({
        success: false,
        message: "No user found"
      });
    }

    const user =
      userResult.rows[0];

    console.log(
      "HASH FROM DB:",
      user.password
    );

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log(
      "PASSWORD MATCH:",
      isMatch
    );

    res.json({

      success: true,

      match: isMatch,

      user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
});

/*
====================================
GET ALL LGAS
====================================
*/

app.get(

  "/api/lgas",

  async (req, res) => {

    try {

      const result =
        await pool.query(`

          SELECT

            lga_id,

            lga_name

          FROM local_governments

          ORDER BY lga_name ASC

        `);

      console.log(
        "LGAS:",
        result.rows
      );

      res.json(
        result.rows
      );

    } catch (error) {

      console.error(
        "LGA FETCH ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch LGAs"
      });
    }
  }
);

/*
====================================
GET WARDS BY LGA
====================================
*/

app.get(

  "/api/wards-by-lga/:lgaId",

  async (req, res) => {

    try {

      const lgaId =
        req.params.lgaId;

      const result =
        await pool.query(

          `

          SELECT

            id AS ward_id,

            ward_name,

            lga_id

          FROM wards

          WHERE lga_id = $1

          ORDER BY ward_name ASC

          `,

          [lgaId]
        );

      res.json(
        result.rows
      );

    } catch (error) {

      console.error(
        "WARD FETCH ERROR:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch wards"
      });
    }
  }
);

/*
====================================
GET POLLING UNITS BY WARD
====================================
*/

app.get(

  "/api/polling-units/:wardId",

  async (req, res) => {

    try {

      const wardId =
        req.params.wardId;

      const result =
        await pool.query(

          `

          SELECT

            polling_unit_id,

            ward_id,

            polling_unit_code,

            polling_unit_name

          FROM polling_units

          WHERE ward_id = $1

          ORDER BY polling_unit_name ASC

          `,

          [wardId]
        );

      res.json(
        result.rows
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch polling units"
      });
    }
  }
);

/*
====================================
GET ALL PARTIES
====================================
*/

app.get(

  "/api/parties",

  async (req, res) => {

    try {

      const result =
        await pool.query(`

          SELECT *
          FROM parties
          ORDER BY code ASC

        `);

      res.json(result.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch parties"
      });
    }
  }
);

/*
====================================
LOGIN
====================================
*/

app.post(

  "/api/login",

  async (req, res) => {

    try {

      console.log("REQ BODY:", req.body);

      const {
        email,
        password
      } = req.body;

      console.log("EMAIL:", email);
      console.log("PASSWORD:", password);

      const result =
        await pool.query(

          `
          SELECT *
          FROM users
          WHERE LOWER(TRIM(email)) =
                LOWER(TRIM($1))
          `,

          [email]
        );

      console.log(
        "ROWS FOUND:",
        result.rows.length
      );

      if (result.rows.length === 0) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid credentials"
        });
      }

      const user =
        result.rows[0];

      console.log(
        "DB HASH:",
        user.password
      );

      const validPassword =
        await bcrypt.compare(

          String(password).trim(),

          String(user.password).trim()
        );

      console.log(
        "PASSWORD MATCH:",
        validPassword
      );

      if (!validPassword) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid credentials"
        });
      }

      const token =
        jwt.sign(

          {
            id: user.id,
            role: user.role
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "1d"
          }
        );

      res.json({

        success: true,

        token,

        user: {

          id: user.id,

          full_name:
            user.full_name,

          email:
            user.email,

          role:
            user.role
        }
      });

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server error"
      });
    }
  }
);

/*
====================================
CREATE USER
====================================
*/

app.post(

  "/api/create-user",

  auth,

  authorizeRoles(

    "super_admin"

  ),

  async (req, res) => {

    try {

      const {

  full_name,
  email,
  phone_number,
  password,
  role

} = req.body;

      const existingUser =
        await pool.query(

          `
          SELECT *
          FROM users
          WHERE email = $1
          `,

          [email]
        );

      if (
        existingUser.rows.length > 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "User already exists"
        });
      }

      const hashedPassword =
        await bcrypt.hash(

          password,

          10
        );

      const result =
  await pool.query(

    `

    INSERT INTO users (

      full_name,
      email,
      phone_number,
      password,
      role

    )

    VALUES (

      $1,$2,$3,$4,$5

    )

    RETURNING

      id,
      full_name,
      email,
      phone_number,
      role

    `,

    [

      full_name,
      email,
      phone_number,
      hashedPassword,
      role
    ]
  );

await createAuditLog(

  req.user.id,

  req.user.role,

  "CREATE_USER",

  `${req.user.role} created ${email}`
);
/*
====================================
REALTIME NOTIFICATION
====================================
*/

io.emit(

  "notification",

  {

    type: "user",

    message:
      `New ${role} account created`
  }
);

      res.json({

        success: true,

        message:
          "User created successfully",

        user:
          result.rows[0]
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to create user"
      });
    }
  }
);

/*
====================================
GET USERS
====================================
*/

app.get(

  "/api/users",

  auth,

  authorizeRoles(

    "super_admin",
    "admin"

  ),

  async (req, res) => {

    try {

      const result =
        await pool.query(`

         SELECT

  id,
  full_name,
  email,
  phone_number,
  role,
  created_at

FROM users

ORDER BY id DESC

        `);

      res.json(result.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch users"
      });
    }
  }
);

/*
====================================
DELETE USER
====================================
*/

app.delete(

  "/api/users/:id",

  auth,

  authorizeRoles(

    "super_admin"

  ),

  async (req, res) => {

    try {

      const id =
        req.params.id;

      /*
      ====================================
      CHECK USER ROLE
      ====================================
      */

      const userResult =
        await pool.query(

          `
          SELECT role
          FROM users
          WHERE id = $1
          `,

          [id]
        );

      if (
        userResult.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "User not found"
        });
      }

      /*
      ====================================
      PREVENT SUPER ADMIN DELETION
      ====================================
      */

      if (

        userResult.rows[0].role

        ===

        "super_admin"

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Super admin cannot be deleted"
        });
      }

      /*
      ====================================
      DELETE USER
      ====================================
      */

      await pool.query(

        `
        DELETE FROM users
        WHERE id = $1
        `,

        [id]
      );
await createAuditLog(

  req.user.id,

  req.user.role,

  "DELETE_USER",

  `${req.user.role} deleted user ID ${id}`
);
      res.json({

        success: true,

        message:
          "User deleted successfully"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to delete user"
      });
    }
  }
);
/*
====================================
APPROVE RESULT
====================================
*/

app.put(

  "/api/approve-result/:id",

  auth,

  authorizeRoles(

    "admin",
    "super_admin"

  ),

  async (req, res) => {

    try {

      const id =
        req.params.id;

      await pool.query(

        `
        UPDATE results

        SET status = 'approved'

        WHERE id = $1
        `,

        [id]
      );

      io.emit(
        "new_result"
      );
      io.emit(

  "notification",

  {

    type: "approval",

    message:
  `A result was approved`
  }
);
      io.emit(

  "approval_notification",

  "A result was approved"
);
await createAuditLog(

  req.user.id,

  req.user.role,

  "APPROVE_RESULT",

  `${req.user.role} approved result ID ${id}`
);

await createNotification(

  "Approval",

  `Result ID ${id} approved`
);

      res.json({

        success: true,

        message:
          "Result approved successfully"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Approval failed"
      });
    }
  }
);

/*
====================================
REJECT RESULT
====================================
*/

app.put(

  "/api/reject-result/:id",

  auth,

  authorizeRoles(

    "admin",
    "super_admin"

  ),

  async (req, res) => {

    try {

      const id =
        req.params.id;

      await pool.query(

        `
        UPDATE results

        SET status = 'rejected'

        WHERE id = $1
        `,

        [id]
      );

      /*
      ====================================
      REALTIME UPDATE
      ====================================
      */

      io.emit(
        "new_result"
      );

      /*
      ====================================
      LIVE NOTIFICATION
      ====================================
      */

      io.emit(

        "notification",

        {

          type: "rejection",

          message:
            "A result was rejected"
        }
      );

      /*
      ====================================
      AUDIT LOG
      ====================================
      */

      await createAuditLog(

        req.user.id,

        req.user.role,

        "REJECT_RESULT",

        `${req.user.role} rejected result ID ${id}`
      );

      await createNotification(

  "Rejection",

  `Result ID ${id} rejected`
);

      /*
      ====================================
      SUCCESS RESPONSE
      ====================================
      */

      res.json({

        success: true,

        message:
          "Result rejected successfully"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Rejection failed"
      });
    }
  }
);

/*
====================================
PENDING RESULTS
====================================
*/

app.get(

  "/api/pending-results",

  auth,

  authorizeRoles(

    "admin",
    "super_admin"

  ),

  async (req, res) => {

    try {

      const result =
        await pool.query(`

          SELECT *
          FROM results

          WHERE status = 'pending'

          ORDER BY id DESC

        `);

      res.json(result.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch pending results"
      });
    }
  }
);

/*
====================================
SUBMIT RESULT
====================================
*/

app.post(

  "/submit-result",

  auth,

  authorizeRoles(

    "admin",
    "super_admin",
    "collation_officer"

  ),

  async (req, res) => {

    try {

      const data = req.body;
/*
====================================
CHECK DUPLICATE RESULT
====================================
*/

const existingResult =
  await pool.query(

    `

    SELECT *

    FROM results

    WHERE polling_unit = $1

    `,

    [data.polling_unit]
  );

if (
  existingResult.rows.length > 0
) {

  return res.status(400).json({

    success: false,

    message:
      "Result already submitted for this polling unit"
  });
}

/*
====================================
VALIDATION ENGINE
====================================
*/

/*
====================================
NEGATIVE VALUE VALIDATION
====================================
*/

if (

  Number(data.total_vote_cast) < 0 ||

  Number(data.valid_vote) < 0 ||

  Number(data.accredited_card) < 0 ||

  Number(data.registered_card) < 0

) {

  return res.status(400).json({

    success: false,

    message:
      "Negative values are not allowed"
  });
}

/*
====================================
NUMERIC CONVERSION
====================================
*/

const registered =
  Number(data.registered_card);

const accredited =
  Number(data.accredited_card);

const totalCast =
  Number(data.total_vote_cast);

const rejected =
  Number(data.total_vote_rejected);

const valid =
  Number(data.valid_vote);

/*
====================================
PARTY TOTAL
====================================
*/

const safeNumber = (value) => {

  return Number(value || 0);
};

const totalPartyVotes =

  safeNumber(data.accord) +

  safeNumber(data.aa) +

  safeNumber(data.aac) +

  safeNumber(data.adc) +

  safeNumber(data.adp) +

  safeNumber(data.apc) +

  safeNumber(data.apga) +

  safeNumber(data.apm) +

  safeNumber(data.app) +

  safeNumber(data.bp) +

  safeNumber(data.dla) +

  safeNumber(data.lp) +

  safeNumber(data.ndc) +

  safeNumber(data.nnpp) +

  safeNumber(data.nrm) +

  safeNumber(data.pdp) +

  safeNumber(data.prp) +

  safeNumber(data.sdp) +

  safeNumber(data.yp) +

  safeNumber(data.ypp) +

  safeNumber(data.zlp);

/*
====================================
VALIDATION RULES
====================================
*/

/* ACCREDITED > REGISTERED */

if (accredited > registered) {

  return res.status(400).json({

    success: false,

    message:
      "Accredited voters cannot exceed registered voters"
  });
}

/* TOTAL CAST > ACCREDITED */

if (totalCast > accredited) {

  return res.status(400).json({

    success: false,

    message:
      "Total votes cast cannot exceed accredited voters"
  });
}

/* VALID + REJECTED */

if ((valid + rejected) !== totalCast) {

  return res.status(400).json({

    success: false,

    message:
      "Valid votes plus rejected votes must equal total votes cast"
  });
}

/* PARTY TOTAL */

if (totalPartyVotes > valid) {

  return res.status(400).json({

    success: false,

    message:
      "Party votes exceed valid votes"
  });
}

      const query = `

        INSERT INTO results (

          ward,
          polling_unit,

          registered_card,
          accredited_card,
          total_vote_cast,
          total_vote_rejected,
          valid_vote,

          accord,
          aa,
          aac,
          adc,
          adp,
          apc,
          apga,
          apm,
          app,
          bp,
          dla,
          lp,
          ndc,
          nnpp,
          nrm,
          pdp,
          prp,
          sdp,
          yp,
          ypp,
          zlp,

          party_agent,
          phone_number,
          presiding_officer,
          status

        )

        VALUES (

          $1,$2,$3,$4,$5,$6,$7,
          $8,$9,$10,$11,$12,$13,
          $14,$15,$16,$17,$18,
          $19,$20,$21,$22,$23,
          $24,$25,$26,$27,$28,
          $29,$30,$31,$32

        )

        RETURNING *;

      `;

      const values = [

        data.ward,
        data.polling_unit,

        data.registered_card,
        data.accredited_card,
        data.total_vote_cast,
        data.total_vote_rejected,
        data.valid_vote,

        data.accord || 0,
        data.aa || 0,
        data.aac || 0,
        data.adc || 0,
        data.adp || 0,
        data.apc || 0,
        data.apga || 0,
        data.apm || 0,
        data.app || 0,
        data.bp || 0,
        data.dla || 0,
        data.lp || 0,
        data.ndc || 0,
        data.nnpp || 0,
        data.nrm || 0,
        data.pdp || 0,
        data.prp || 0,
        data.sdp || 0,
        data.yp || 0,
        data.ypp || 0,
        data.zlp || 0,

        data.party_agent,
        data.phone_number,
        data.presiding_officer,

        "pending"
      ];

      const result =
        await pool.query(
          query,
          values
        );

      io.emit(

        "new_result",

        {

          message:
            "New election result submitted"
        }
      );
      io.emit(

  "notification",

  {

    type: "submission",

    message:
      `New result submitted for ${data.polling_unit}`
  }
);

await createAuditLog(

  req.user.id,

  req.user.role,

  "SUBMIT_RESULT",

  `${req.user.role} submitted PU result`
);

await createNotification(

  "Submission",

  `New result submitted for ${data.polling_unit}`
);

      res.json({

        success: true,

        message:
          "Election result saved successfully",

        data:
          result.rows[0]
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to save result"
      });
    }
  }
);

/*
====================================
GET ALL RESULTS
====================================
*/

app.get(

  "/results",

  async (req, res) => {

    try {

      const result =
        await pool.query(`

          SELECT *
          FROM results

          WHERE status = 'approved'

          ORDER BY id DESC

        `);

      res.json(result.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch results"
      });
    }
  }
);

/*
====================================
OVERVOTING DETECTION
====================================
*/

app.get(

  "/api/overvoting",

  auth,

  async (req, res) => {

    try {

      const result =
        await pool.query(

          `

          SELECT

            id,

            ward,

            polling_unit,

            accredited_card,

            total_vote_cast,

            (

              total_vote_cast

              -

              accredited_card

            ) AS excess_votes

          FROM results

          WHERE

            total_vote_cast

            >

            accredited_card

          AND

            status = 'approved'

          ORDER BY excess_votes DESC

          `
        );

      res.json(
        result.rows
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch overvoting data"
      });
    }
  }
);

/*
====================================
WARD SUMMARIES
====================================
*/

app.get(

  "/api/all-ward-summaries",

  async (req, res) => {

    try {

      const query = `

        SELECT

          ward,

          SUM(aac) AS aac,
          SUM(adc) AS adc,
          SUM(adp) AS adp,
          SUM(apc) AS apc,
          SUM(apga) AS apga,
          SUM(apm) AS apm,
          SUM(app) AS app,
          SUM(bp) AS bp,
          SUM(lp) AS lp,
          SUM(ndc) AS ndc,
          SUM(nnpp) AS nnpp,
          SUM(nrm) AS nrm,
          SUM(pdp) AS pdp,
          SUM(prp) AS prp,
          SUM(sdp) AS sdp,
          SUM(ypp) AS ypp,
          SUM(zlp) AS zlp,

          SUM(valid_vote)
          AS total_valid_votes,

          SUM(total_vote_cast)
          AS total_votes_cast,

          SUM(registered_card)
          AS total_registered_voters,

          SUM(accredited_card)
          AS total_accredited_voters,

          COUNT(id)
          AS polling_units_reported

        FROM results

        WHERE status = 'approved'

        GROUP BY ward

        ORDER BY ward ASC

      `;

      const result =
        await pool.query(query);

      const processed =
        result.rows.map((row) => {

          return {

            ...row,

            ...detectLeadingParty(row)
          };
        });

      res.json(processed);

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch ward summaries"
      });
    }
  }
);

/*
====================================
LGA SUMMARIES
====================================
*/

app.get(

  "/api/lga-summaries",

  async (req, res) => {

    try {

      const query = `

        SELECT

          lg.lga_name,

          SUM(r.aac) AS aac,
          SUM(r.adc) AS adc,
          SUM(r.adp) AS adp,
          SUM(r.apc) AS apc,
          SUM(r.apga) AS apga,
          SUM(r.apm) AS apm,
          SUM(r.app) AS app,
          SUM(r.bp) AS bp,
          SUM(r.lp) AS lp,
          SUM(r.ndc) AS ndc,
          SUM(r.nnpp) AS nnpp,
          SUM(r.nrm) AS nrm,
          SUM(r.pdp) AS pdp,
          SUM(r.prp) AS prp,
          SUM(r.sdp) AS sdp,
          SUM(r.ypp) AS ypp,
          SUM(r.zlp) AS zlp,

          SUM(r.valid_vote)
          AS total_valid_votes,

          SUM(r.total_vote_cast)
          AS total_votes_cast,

          SUM(r.registered_card)
          AS total_registered_voters,

          SUM(r.accredited_card)
          AS total_accredited_voters,

          COUNT(r.id)
          AS polling_units_reported

        FROM results r

        JOIN wards w
        ON r.ward = w.ward_name

        JOIN local_governments lg
        ON w.lga_id = lg.lga_id

        WHERE r.status = 'approved'

        GROUP BY lg.lga_name

        ORDER BY lg.lga_name ASC

      `;

      const result =
        await pool.query(query);

      const processed =
        result.rows.map((row) => {

          return {

            ...row,

            ...detectLeadingParty(row)
          };
        });

      res.json(processed);

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch LGA summaries"
      });
    }
  }
);

/*
====================================
STATE SUMMARY
====================================
*/

app.get(

  "/api/state-summary",

  async (req, res) => {

    try {

      const query = `

        SELECT

          SUM(aac) AS aac,
          SUM(adc) AS adc,
          SUM(adp) AS adp,
          SUM(apc) AS apc,
          SUM(apga) AS apga,
          SUM(apm) AS apm,
          SUM(app) AS app,
          SUM(bp) AS bp,
          SUM(lp) AS lp,
          SUM(ndc) AS ndc,
          SUM(nnpp) AS nnpp,
          SUM(nrm) AS nrm,
          SUM(pdp) AS pdp,
          SUM(prp) AS prp,
          SUM(sdp) AS sdp,
          SUM(ypp) AS ypp,
          SUM(zlp) AS zlp,

          SUM(valid_vote)
          AS total_valid_votes,

          SUM(total_vote_cast)
          AS total_votes_cast,

          SUM(registered_card)
          AS total_registered_voters,

          SUM(accredited_card)
          AS total_accredited_voters,

          COUNT(id)
          AS polling_units_reported

        FROM results

        WHERE status = 'approved'

      `;

      const result =
        await pool.query(query);

      const row =
        result.rows[0];

      const processed = {

        ...row,

        ...detectLeadingParty(row),

        state_name:
          "Bauchi State"
      };

      res.json(processed);

    } catch (error) {

console.error(

  "SUBMIT RESULT ERROR:",

  error.message
);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch state summary"
      });
    }
  }
);

/*
====================================
GET NOTIFICATIONS
====================================
*/

app.get(

  "/api/notifications",

  async (req, res) => {

    try {

      const result =
        await pool.query(

          `
          SELECT *
          FROM notifications
          ORDER BY created_at DESC
          LIMIT 100
          `
        );

      res.json(
        result.rows
      );

    } catch (error) {

  console.error(
    "NOTIFICATION ERROR:",
    error.message
  );

  res.status(500).json({
    success: false,
    message: error.message
  });
}
  }
);

/*
====================================
UNREAD NOTIFICATION COUNT
====================================
*/

app.get(
  "/api/notifications/unread-count",
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT COUNT(*) AS total
          FROM notifications
          WHERE is_read = FALSE
          `
        );

      res.json({
        count: Number(result.rows[0].total)
      });

    } catch (error) {

      console.error(
        "UNREAD COUNT ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        error: error.message,

        detail: error
      });
    }
  }
);

/*
====================================
MARK ALL NOTIFICATIONS READ
====================================
*/

app.put(

  "/api/notifications/read-all",

  async (req, res) => {

    try {

      await pool.query(

        `
        UPDATE notifications
        SET is_read = TRUE
        WHERE is_read = FALSE
        `
      );

      res.json({

        success: true
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false
      });
    }
  }
);

/*
====================================
GET AUDIT LOGS
====================================
*/

app.get(

  "/api/audit-logs",

  auth,

  authorizeRoles(

    "admin",
    "super_admin"

  ),

  async (req, res) => {

    try {

      const result =
        await pool.query(`

          SELECT *
          FROM audit_logs

          ORDER BY id DESC

        `);

      res.json(result.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch audit logs"
      });
    }
  }
);

/*
====================================
START SERVER
====================================
*/

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(

    `Server running on port ${PORT}`
  );
});