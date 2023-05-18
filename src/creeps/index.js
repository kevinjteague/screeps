
var config = require("../config.js");
let creepLogic;
if(config.behaviorLevel < 4){
    creepLogic = {
        worker:      require('./worker-low'),
    }
}else{
    creepLogic = {
        harvester:     require('./harvester'),
        worker:      require('./worker'),
    }
}

module.exports = creepLogic;