## svstat

A node.js wrapper for daemontools [svstat](http://cr.yp.to/daemontools/svstat.html).

```javascript
var serviceDir = "./service";

svstat(serviceDir, function(err, result) {
    console.log(err, result);
});
```
