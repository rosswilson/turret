const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

const pool = new Pool({
  database: "turret_dev",
});

pool.on("error", (error) => {
  console.error("Unexpected error with idle database client", error);
});

async function listClients() {
  const client = await pool.connect();

  try {
    const { rows } = await client.query("SELECT * from clients");

    return rows;
  } finally {
    client.release();
  }
}

async function insertClient(payload) {
  const id = uuidv4();

  const { name, redirectUris, responseTypes, grantTypes } = payload;

  const client = await pool.connect();

  try {
    const text = `
    INSERT INTO clients(
      id, name, redirect_uris, response_types, grant_types, inserted_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;

    const values = [
      id,
      name,
      `{${redirectUris.join(",")}}`,
      `{${responseTypes.join(",")}}`,
      `{${grantTypes.join(",")}}`,
      "now()",
      "now()",
    ];

    const { rows } = await client.query(text, values);

    return { rows };
  } finally {
    client.release();
  }
}

module.exports = { listClients, insertClient };
