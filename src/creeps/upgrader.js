var config = require("../config.js");
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.job == 'harvest'){
            if(creep.store.getFreeCapacity() > 0) {
                var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }else{
                creep.memory.job = 'upgrade';
            }
        }
        if(creep.memory.job == 'upgrade') {
            let response = creep.upgradeController(creep.room.controller)
            if(response == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }else if(response == ERR_NOT_ENOUGH_RESOURCES){
                creep.memory.job = 'harvest';
            }
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == room.name);
        console.log('Upgraders: ' + upgraders.length, room.name);

        if (upgraders.length < config.upgraderCount) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Upgrader' + Game.time;
            let body = [WORK, CARRY, CARRY, MOVE, MOVE];
            let memory = {role: 'upgrader', job: 'harvest'};
        
            return {name, body, memory};
    }
};

module.exports = roleUpgrader;