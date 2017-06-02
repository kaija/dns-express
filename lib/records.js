'use-strict';
var fs = require('fs');
var path = require('path');
// Export all the record types at the top-level
var subdir = path.join(__dirname, 'records');
fs.readdirSync(subdir).forEach(function(f) {
    var name = path.basename(f);
    if (/\w+\.js/.test(name)) {
        var k = name.split('.').shift().toUpperCase() + 'Record';
        module.exports[k] = require(path.join(subdir, f));
    }
});
