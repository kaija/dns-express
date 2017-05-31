const dns = require('dns');
dns.resolve('g5smycng5vviyrz65tndp7kr5gnoviyd._domainkey.0935801661.com', 'CNAME',(err, records) => {
  console.log(err);
  console.log(records);
});
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
//dns.lookup('g5smycng5vviyrz65tndp7kr5gnoviyd._domainkey.0935801661.com', options, (err, address, family) => {
//console.log('address: %j family: IPv%s', address, family);
//});
