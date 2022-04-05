const { Pool, Client } = require("pg");

const credentials = {
    user: "postgres",
    host: "app-geocementos.cvfmy4fdfph6.us-east-1.rds.amazonaws.com",
    database: "appgeocementosdb",
    password: "Tintaya123.",
    port: 5432,
  };

  app.post('/pg', async function (req, res) {
    const pool = new Pool(credentials);
    //const now = await pool.query("SELECT ejemplo($1,$2)", [5, 4]);

    var num1 = Number(req.body.centro);
    const now = await pool.query("CALL public.saldos($1)", [num1]);
    await pool.end();
    res.send(now);
  });