var config = require("../config.js");
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.job == 'harvest'){
            if(creep.store.getFreeCapacity() > 0) {
                var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }else{
                creep.memory.job = 'build';
            }
        }
        if(creep.memory.job == 'build') {
            let site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(_.isNull(site)){
                creep.memory.job = 'repair';
            }else{
                response = creep.build(site);
                if(response == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site);
                }else if(response == ERR_NOT_ENOUGH_RESOURCES){
                    creep.memory.job = 'harvest';
                }
            }
        }
        if(creep.memory.job == 'repair'){
            let site = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter:function(o){ return o.structureType !== STRUCTURE_WALL && (o.hits > o.hitsMax) }});
            if(_.isNull(site)){
                site = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter:function(o){ return o.hits > config.wallHits }});
            }else if(_.isNull(site)){
                creep.memory.job == 'upgrade';
            }{
                response = creep.build(site);
                if(response == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }else if(response == ERR_NOT_ENOUGH_RESOURCES){
                    creep.memory.job = 'harvest';
                }
            }
        }
        if(creep.memory.job == 'upgrade'){
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
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
        console.log('Builders: ' + builders.length, room.name);

        if (builders.length < config.builderCount) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Builder' + Game.time;
            let body = [WORK, CARRY, CARRY, MOVE, MOVE];
            let memory = {role: 'builder', job: 'harvest'};
        
            return {name, body, memory};
    }
};

module.exports = roleBuilder;