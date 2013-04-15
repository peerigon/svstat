"use strict";

var fs = require("fs"),
    exec = require('child_process').exec;

function parseSvcString(processStr, serviceDir) {

    var processSplit = processStr.split(" ");

    return {
        name : processSplit[0].substr(serviceDir.length+1, processSplit[0].length - serviceDir.length - 2),
        status : processSplit[1],
        pid : processSplit[3].substr(0, processSplit[3].length-2),
        uptime : processSplit[4]
    };
}

function svstat(serviceDir, callback) {

    var dirs = [],
        svStatCmd = "svstat ",
        result = {};

    try{
        dirs = fs.readdirSync(serviceDir);
    }
    catch(error) {
        callback("Could not read service-dir - Error: " + error.message);
    }

    dirs.forEach(function(serviceName) {
        svStatCmd += serviceDir + "/" + serviceName + " ";
    });

    exec(svStatCmd, function (error, stdout) {

        if (error !== null) {
            callback(new Error("Could not execute '" + svStatCmd + "' - Error: ", error.message));
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