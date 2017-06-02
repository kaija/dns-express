var named = require('../lib');
var cares = require('cares');

var server = named.createServer();

upstream = new cares.Resolver({
    servers: ['168.95.1.1']
});

server.listen(53, '127.0.0.1', function() {
    console.log('DNS server started on port 53');
});


var cares2type = new Map();

var type2cares = new Map();
type2cares.set('ANY');

function feedanser(domain, query, response){
    response.answer.forEach(function(ans) {
        if (ans.type == cares.NS_T_A) {
            query.addAnswer(domain, new named.ARecord(ans.address), ans.ttl);
        }else if (ans.type == cares.NS_T_NS) {
            query.addAnswer(domain, new named.NSRecord(ans.data), ans.ttl);
        }else if (ans.type == cares.NS_T_SOA) {
            query.addAnswer(domain, new named.SOARecord(ans.name, ans), ans.ttl);
        }
    });
}

server.on('query', function(query) {
    var domain = query.name();
    if ( !domain ) return;
    console.log(domain);
    upstream.query(domain, {type: query._question.type, class: cares.NS_C_IN,}, (err, response) => {
        //console.log(err);
        //console.log(response);
        feedanser(domain, query, response);
        server.send(query);
    });
});
