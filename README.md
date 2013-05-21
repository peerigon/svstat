## svstat

A node.js wrapper for daemontools [svstat](http://cr.yp.to/daemontools/svstat.html).

## Example

```javascript

var svstat = require("svstat");

var serviceDir = "./service";

svstat(serviceDir, function(err, result) {
    console.log(result);
});
```

__Result__

```javascript
{
    mongodb: {
        name: 'mongodb',
        status: 'up',
        pid: '1626',
        uptime: '663786'
    },
    backup: {
        name: 'backup',
        status: 'up',
        pid: '2628',
        uptime: '56660'
    },
    svcMonitor: {
        name: 'svcMonitor',
        status: 'down',
        uptime: null,
        pid: null,
        downtime: '2790'
    }
}
```