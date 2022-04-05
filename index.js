const express = require("express");
const jwt = require("jsonwebtoken");

const bodyParser = require('body-parser');

const SQLSP = require("./mssql/mssql_service.js");

const sp = new SQLSP();
const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.post('/api/exec_procedure', function (req, res) {

    sp.exec(req.body.name, req.body.parameters).then((response) => {
      console.log('RESPONSE',response);
      res.send(response.recordsets);
    }).catch((error) => {
      res.status(500).send({
        message: error
      });
    })
  });

  app.post("/api/login", function (req, res) {
    sp.exec("seguridad.prc_login", {tcUsuario: req.body.username, tcPassword: req.body.password}).then((response) => {
      jwt.sign({user: response.recordset[0]}, 'secretkey', {expiresIn: '2h'}, (err, token) => {
        res.json({
          usuario: response.recordset[0],
          token: token
        })
      });
    }).catch((error) => {
      res.status(401).send({
        message: error
      });
    })
  });

  app.get("/api/personas", function (req, res) {
    sp.exec("REPCAS_PERSONAS_PRUEBA", {}).then((response) => {
      console.log(response);
      jwt.sign({user: response.recordset[0]}, 'secretkey', {expiresIn: '2h'}, (err, token) => {
        res.json({
          usuario: response.recordset[0],
          token: token
        })
      });
    }).catch((error) => {
      res.status(401).send({
        message: error
      });
    })
  });

  function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    
    if(typeof bearerHeader !== 'undefined') {
      const bearerToken = bearerHeader.split(" ")[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
  }

  app.listen(3000, () => {
   console.log("El servidor está inicializado en el puerto 3000");
  });

  //app.listen(process.env.PORT || 3000);