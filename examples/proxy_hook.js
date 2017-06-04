var named = require('../lib');

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
