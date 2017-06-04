# libdns
DNS library for server and proxy

This library is forked from https://github.com/trevoro/node-named

## Enhancement

* Support proxy mode with multiple nameserver upstream
* Support hook callback before and after query
* Example of DNS blacklist. https://www.projecthoneypot.org/httpbl.php

## Support Record Type

* A
* AAAA
* SOA
* MX
* TXT
* SRV


### Create a multiple upstream DNS proxy

```javascript
var named = require('libdns');

var proxy = named.createProxy(['8.8.8.8', '168.95.1.1']);

proxy.listen(53, '127.0.0.1', function() {
    console.log("Listen DNS on port 53");
});

```


### Bump some domain

```javascript
var named = require('libdns');

function before_query(domain){
    console.log(domain);
    if (domain.endsWith('.apple.com')) {
        r={}
        r.answer = [{name: domain, class: 1, type:1, ttl:300, address:'1.1.1.1'}];
        return r;
    }else{
        return {};
    }
};

function after_query(response){
    console.log(response);
    response.answer = [ { name: response.question[0].name,
        class: 1,
        type: 1,
        ttl: 299,
        address: '8.8.8.8' }];
};

var proxy = named.createProxy(['8.8.8.8', '168.95.1.1'], {before: before_query, after: after_query});

proxy.listen(53, '127.0.0.1', function() {
    console.log("Listen DNS on port 53");
});
```
