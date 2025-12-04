// db/pool.js

const pool = new Pool({
  user: "milkteapuppy",
  host: "localhost",
  database: "members_only",
  password: "0607",
  port: 5432,
});

module.exports = pool;
