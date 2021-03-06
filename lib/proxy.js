'use-strict';
var Server = require('./server');
var cares = require('cares');
var records = require('./records');
var validator = require('./validators');

function feedanser(domain, query, response){
    if (typeof(response) !== 'object')
        return; //throw new TypeError('response is not object');

    response.answer.forEach(function(ans) {
        if (ans.type == cares.NS_T_A) {
            query.addAnswer(domain, new records.ARecord(ans.address), ans.ttl);
        }else if (ans.type == cares.NS_T_NS) {
            query.addAnswer(domain, new records.NSRecord(ans.data), ans.ttl);
        }else if (ans.type == cares.NS_T_MX) {
            query.addAnswer(domain, new records.MXRecord(ans.exchange, ans), ans.ttl);
        }else if (ans.type == cares.NS_T_TXT) {
            query.addAnswer(domain, new records.TXTRecord(ans.data[0]), ans.ttl);
        }else if (ans.type == cares.NS_T_SRV) {
            query.addAnswer(domain, new records.SRVRecord(ans.target, ans.port, ans), ans.ttl);
        }else if (ans.type == cares.NS_T_AAAA) {
            query.addAnswer(domain, new records.AAAARecord(ans.address), ans.ttl);
        }else if (ans.type == cares.NS_T_SOA) {
            query.addAnswer(domain, new records.SOARecord(ans.name, ans), ans.ttl);
        }
    });
}

function Proxy(upstreams, options) {
    if (typeof(options) !== 'object')
        throw new TypeError('options (object) is required');
    if (typeof(upstreams) !== 'object' )
        throw new TypeError('upstreams (object) is required');

    var self = this;

    server = new Server(options);
    this._server = server;

    ns_upstreams = upstreams.map(function(ns){
        if ( !validator.IPv4 )
            throw new TypeError('ns (IPv4) is required');

        console.log("create resolver by: " + ns);
        return new cares.Resolver({servers: [ns]});
    });

    self.hook_before_query = options.hook_before_query;
    self.hook_after_query = options.hook_after_query;
    self.hook_before_callback = options.hook_before_callback;
    self.hook_after_callback = options.hook_after_callback;

    server.on('query', function(query) {
        var domain = query.name();
        if ( !domain ) return;
        //Hook pre query
        if (self.hook_before_query) {
            response = self.hook_before_query(domain);
            //Direct output without query
            if (response.answer) {
                feedanser(domain, query, response);
                server.send(query);
                return;
            }
        }
        if (self.hook_before_callback) {
            self.hook_before_callback(domain, function(err, response){
                //Direct output without query
                if (response.answer) {
                    feedanser(domain, query, response);
                    server.send(query);
                    return;
                }
            });
        }
        var upstream = ns_upstreams[Math.floor(Math.random() * ns_upstreams.length)];
        upstream.query(domain, {type: query._question.type, class: cares.NS_C_IN,}, (err, response) => {
            //Hook post query
            if (self.hook_after_query) {
                self.hook_after_query(response);
            }
            if (err) {
                this._log.trace({ err: err }, 'send: uncaughtException');
            } else {
                feedanser(domain, query, response);
                server.send(query);
            }

            if (self.hook_after_callback) {
                self.hook_after_callback(response, function(err, response){
                    if (err) {
                        this._log.trace({ err: err }, 'send: uncaughtException');
                    } else {
                        feedanser(domain, query, response);
                        server.send(query);
                    }
                });
            }
        });
    });
}


Proxy.prototype.listen = function (port, address, callback) {
    this._server.listen(port, address, callback);       
};

module.exports = Proxy;
