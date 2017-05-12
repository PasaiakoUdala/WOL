
module.exports = function (app) {

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

        var sql ="SELECT * " +
        "FROM hardware " +
        "LEFT JOIN networks " +
        "on hardware.ID=networks.HARDWARE_ID " +
        "LEFT JOIN accountinfo " +
        "on hardware.ID=accountinfo.HARDWARE_ID " +
        "WHERE Tag NOT LIKE 'ZERBI%' " +
        "AND Tag NOT LIKE 'BEREZIA' " +
        "AND Tag NOT LIKE 'Kanpokoa' " +
        "AND Tag NOT LIKE 'BIRTUALA' " +
        "AND Tag NOT LIKE 'Baztertua'";

        conn.query(sql,function (err, rows, fields) {
            if (err) throw err;
            res.json(rows);
        })

    });

    app.get('/winexe/:cmd/:ip', function (req, res) {
        var cmd = require('node-cmd');
        var options = require('./options');


        var passwd = options.storageConfig.WINEXEPASSWD;
        var ip = req.params.ip;
        var command = req.params.cmd;
        var q ="";
        var resp = {};
        resp.result = -1;

        if ( command === "session" ) {
            q = 'winexe --user=admin --password=' + passwd + ' //' + ip + ' "reset session 0"';
        } else if ( command === "reboot") {
            q = 'winexe --user=admin --password=' + passwd + ' //' + ip + ' "shutdown -t 30 -r -f -c \"Ordenagailua-berrabiarazten\" " ';
        } else if ( command === "shutdown") {
                q = 'winexe --user=admin --password=' + passwd + ' //' + ip + ' "shutdown -t 30 -s -f -c \"Ordenagailua-itzaltzen.\" " ';
        } else if ( command === "screensaver") {
            q = 'winexe --user=admin --password=' + passwd + ' //' + ip + ' tasklist |grep scr -c';
        }

        console.log(q);

        cmd.get(
            q,
            function(err, data, stderr){
                resp.result = 1;
                if (err) {
                    resp.result = 0;
                }
                if ( command === "screensaver") {
                    resp.result = data;
                }
            }
        );

        res.json(resp);

    });

};
