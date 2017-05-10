
module.exports = function (app) {

    // application -------------------------------------------------------------
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


    app.get('/ping/:ip', function (req, res, next) {
        var ping = require('ping');
        var ip = req.params.ip;
        console.log("Ping egiten " + ip + " ari...");
        ping.sys.probe(ip, function(isAlive){
            var msg = isAlive ? 'host ' + ip + ' is alive' : 'host ' + ip + ' is dead';
            console.log(msg);
            var resp = {};
            resp.alive = isAlive;
            res.json(resp);
        });
    });

    app.get('/wol/:mac', function (req, res, next) {
        var wol = require('node-wol');
        var mac = req.params.mac;
        var resp = {};
        resp.wol = true;

        wol.wake(mac, function(error) {
            if(error) {
               resp.wol = false;
            }
        });

        res.json(resp);

    });

    app.get('/api/pcs', function (req, res) {
        var mysql = require('mysql');
        var options = require('./options');
        var conn = mysql.createConnection({
            host: options.storageConfig.HOST,
            user: options.storageConfig.USER,
            password: options.storageConfig.PASSWD,
            database: options.storageConfig.DB
        });

        conn.connect(function (err) {
            if (err) throw err;
        });

        var sql = "SELECT * " +
            "FROM hardware " +
            "LEFT JOIN networks " +
            "   on hardware.ID=networks.HARDWARE_ID " +
            "LEFT JOIN accountinfo " +
            "   on hardware.ID=accountinfo.HARDWARE_ID "

        conn.query(sql,function (err, rows, fields) {
            if (err) throw err;
            res.json(rows);
        })

    });
};
