var dns = require('../lib');
var sleep = require('sleep');
dnsd = dns.createServer({'a':'b'});
dnsd.listen('0.0.0.0', 53);
