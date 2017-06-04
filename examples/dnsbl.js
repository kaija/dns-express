var named = require('../lib');

function hook(hostname){
    re = /(\w+)\.(\d+)\.(\d+)\.(\d+)\.(\d+)\.dnsbl\.httpbl\.org/;
    namelist = hostname.split(re);
    if (namelist.length === 7) {
        query_ip = namelist[5] + '.' + namelist[4] + '.' + namelist[3] + '.' + namelist[2];
        console.log('query IP: ' + query_ip + ' with key: ' + namelist[1]);
        r={}
        r.answer = [{name: hostname, class: 1, type:1, ttl:300, address:'127.3.5.1'}];
        return r;
    }else {
        return {};
    }
};

var proxy = named.createProxy(['8.8.8.8', '168.95.1.1'], {before: hook});

proxy.listen(53, '127.0.0.1', function() {
    console.log("Listen DNS on port 53");
});
