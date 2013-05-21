"use strict";

var fs = require("fs"),
    exec = require('child_process').exec;

///up /home/peerigon/service/bananabombcanon/: up (pid 3074) 366940 seconds
//down: /home/peerigon/service/svcMonitor/: down 140 seconds, normally up
//defunct: /home/peerigon/service/test/: up (pid 30227) 0 seconds

function parseSvcString(processStr, serviceDir) {

    var processSplit = processStr.split(" "),
        status = processSplit[0];

    if(status === "up") {
        return {
            name : processSplit[0].substr(serviceDir.length+1, processSplit[0].length - serviceDir.length - 2),
            status : processSplit[1],
            pid : processSplit[3].substr(0, processSplit[3].length-2),
            uptime : processSplit[4]
        };
    }

    return {
        name : processSplit[0].substr(serviceDir.length+1, processSplit[0].length - serviceDir.length - 2),
        status : processSplit[1],
        uptime : null,
        pid : null,
        downtime : processSplit[2]
    }
}

function svstat(serviceDir, callback) {

    var dirs = [],
        svStatCmd = "svstat ",
        result = {};

    try{
        dirs = fs.readdirSync(serviceDir);
    }
    catch(error) {
        callback("Could not read service-dir: " + error.message);
    }

    dirs.forEach(function(serviceName) {
        svStatCmd += serviceDir + "/" + serviceName + " ";
    });

    exec(svStatCmd, function (error, stdout) {

        if (error !== null) {
            callback(new Error("Could not execute '" + svStatCmd + "': ", error.message));
            return;
        }

        //split by ln and remove last empty line
        var processes = stdout.split("\n");
        processes.splice(processes.length - 2);

        processes.forEach(function(process) {
            process = parseSvcString(process, serviceDir);
            result[process.name] = process;
        });

        callback(null, result);
    });
}

module.exports = svstat;