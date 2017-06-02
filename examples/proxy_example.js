var named = require('../lib');
var proxy = named.createProxy(['8.8.8.8', '168.95.1.1']);
proxy.listen(53, '127.0.0.1', function() {
  console.log("Listen DNS on port 53");
});
