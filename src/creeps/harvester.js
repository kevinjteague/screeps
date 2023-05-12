var config = require("../config.js");
var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.job == 'upgrade'){
            if(creep.store.getUsedCapacity() > 0){
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller);
                }
            }else{
                creep.memory.job = 'harvest';
            }
        }
        else if(creep.store.getFreeCapacity() > 0) {
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            let response = creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY);
            if(response == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }else{
                creep.memory.job = 'upgrade';
            }
            
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
        console.log('Harvesters: ' + harvesters.length, room.name);

        if (harvesters.length < config.harvesterCount) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Harvester' + Game.time;
            let body = [WORK, CARRY, CARRY, MOVE, MOVE];
            let memory = {role: 'harvester'};
        
            return {name, body, memory};
    }
};

module.exports = harvester;