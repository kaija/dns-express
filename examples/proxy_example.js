var named = require('../lib');

function b(d){
    console.log(d);
    r={}
    r.answer = [{name: d, class: 1, type:1, ttl:300, address:'1.1.1.1'}];
    return r;
};

function a(r){
    console.log(r);
    r.answer = [ { name: 'www.google.com',
        class: 1,
        type: 1,
        ttl: 299,
        address: '8.8.8.8' }];
};

var proxy = named.createProxy(['8.8.8.8', '168.95.1.1'], {before: b, after: a});

proxy.listen(53, '127.0.0.1', function() {
    console.log("Listen DNS on port 53");
});
