//const sql = require('mssql');
const sql = require("mssql/msnodesqlv8");

const sqlConfigWIN = {
    server: 'datos5',
    driver: "msnodesqlv8",
    pool: {
      max: 10,
      min: 1,
      idleTimeoutMillis: 30000
    },
    options: {
      trustedConnection: true,
      trustServerCertificate: true
    }
}

  const sqlConfigSA = {
    user: 'willian',
    password: '12345678',
    database: 'DB_PEDIDOSMOVIL_REPCAS_PRUEBA',
    server: 'localhost',
    driver: "msnodesqlv8",
    //port: 15625,
    pool: {
      max: 10,
      min: 1,
      idleTimeoutMillis: 30000
    },
    options: {
      trustServerCertificate: true,
    }
  }

class SQLSP {

    constructor() {
        this.connectionPool = null;
    }

    connect() {

        if (this.connectionPool) {
            return this.connectionPool;
        }

        this.connectionPool = new Promise((resolve, reject) => {

            const pool = new sql.ConnectionPool(sqlConfigSA);

            pool.on('close', () => {
            });

            pool.connect().then(connPool => {
                return resolve(connPool);
            }).catch(err => {
                return reject(err);
            });
        });

        return this.connectionPool;
        
    }

    getConnectionStatus() {
        return new Promise((resolve, reject) => {
            this.connect().then(res => {
                resolve(res.connected);
            }).catch(err => {
                reject(err)
            })
        })
    }

    exec(StoredProcedureaName, Parameters) {
        return new Promise((resolve, reject) => {
            this.connect().then(connPool => {
                const request = new sql.Request(connPool);

                for (var llave in Parameters) {
                    switch (typeof Parameters[llave]) {
                        case 'string':
                            request.input(String(llave), sql.VarChar(sql.MAX), Parameters[llave])
                            break;
                        case 'number':
                            request.input(String(llave), sql.Int, Parameters[llave])
                            break;
                        case 'object':
                            request.input(String(llave), sql.DateTime, Parameters[llave])
                            break;
                        case 'Boolean':
                            request.input(String(llave), sql.Bit, Parameters[llave])
                            break;
                        default:
                            request.input(String(llave), sql.VarChar(sql.MAX), Parameters[llave])
                            break;
                    }
                }

                console.log('PARAMETERS', request);

                request.execute(StoredProcedureaName, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })

                sql.on('error', err => {
                    reject(err);
                })
            })
        });
    }
}
module.exports = SQLSP;