var config = require("../config.js");
var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let defined = false;
        if(creep.memory.job === 'new'){
            creep.room.memory.harvestAssignments[creep.name] = {};
            let source = creep.room.find(FIND_SOURCES, {filter:function(o){ 
                let keys = Object.keys(creep.room.memory.harvestAssignments);
                for(const key of keys){
                    claim = creep.room.memory.harvestAssignments[key];     
                    if (claim['x'] === o.pos.x){                                  //change to always having assignment memory and having valid or invalid assignments with -pos
                        if(claim['y'] === o.pos.y){
                            return false;
                        }
                    }
                }
                return true;}})
            

            if(source.length > 0){
                creep.room.memory.harvestAssignments[creep.name].x = source[0].pos.x;
                creep.room.memory.harvestAssignments[creep.name].y = source[0].pos.y;
            }
            creep.memory.job = 'working';
        }
        if(creep.ticksToLive < 10){
            delete creep.room.memory.harvestAssignments[creep.name];
            creep.suicide();
        }else{
            let source = creep.room.lookForAt(LOOK_SOURCES, creep.room.memory.harvestAssignments[creep.name].x, creep.room.memory.harvestAssignments[creep.name].y)[0];
            if(creep.store.getFreeCapacity() > 0){
                creep.say('mining');
                if(creep.harvest(source) === ERR_NOT_IN_RANGE){
                    creep.moveTo(source);
                }
            }else{
                creep.say('storing');
                let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter:function(o){return o.structureType === STRUCTURE_LINK}});
                if(creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                    creep.moveTo(container);
                }
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
            let body = [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY];
            let memory = {role: 'harvester', job: 'new'};
        
            return {name, body, memory};
    }
};

module.exports = harvester;