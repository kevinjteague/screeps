var config = require("../config.js");
var roleWorker = {

    /** @function run
     * @param {Creep} creep 
     * A
     * 
     * **/
    run: function(creep) {
        if(creep.ticksToLive < 10){
            delete creep.room.memory.assignments[creep.name];
            creep.suicide();
        }else if(creep.memory.job === 'new'){
            creep.room.memory.assignments[creep.name] = {};
            creep.room.memory.assignments[creep.name].x = -1;
            creep.room.memory.assignments[creep.name].y = -1;      
            creep.memory.job = "empty";
        }else if(creep.memory.job === "empty"){
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(creep.harvest(source) === ERR_NOT_IN_RANGE){
                creep.moveTo(source);
            }else if(creep.store.getFreeCapacity() === 0){
                creep.memory.job = null;
            }
        }else if(creep.memory.job !== null){
            let target = creep.room.lookForAt(LOOK_STRUCTURES, creep.room.memory.assignments[creep.name].x, creep.room.memory.assignments[creep.name].y)[0];
            let response;
            switch(creep.memory.job) {
                case "transfer":
                    response = creep.transfer(target, RESOURCE_ENERGY);
                    if(response === ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }else{
                        console.log("Transfer Error:" + response);
                        creep.room.memory.assignments[creep.name].x = -1;
                        creep.room.memory.assignments[creep.name].y = -1;
                        creep.memory.job = "empty";
                    }
                    break;
                case "build":
                    target = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep.room.memory.assignments[creep.name].x, creep.room.memory.assignments[creep.name].y)[0];
                    response = creep.build(target);
                    if(response === ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }else if(response === ERR_NOT_ENOUGH_RESOURCES){
                        creep.room.memory.assignments[creep.name].x = -1;
                        creep.room.memory.assignments[creep.name].y = -1;
                        creep.memory.job = "empty";
                    }else if(response === 0){
                        //Operation completed successfully
                    }else{
                        creep.room.memory.assignments[creep.name].x = -1;
                        creep.room.memory.assignments[creep.name].y = -1;
                        if(creep.store.getUsedCapacity() > 0){
                            creep.memory.job = "empty";
                        }
                    }
                    break;
                case "repair":
                    response = creep.repair(target);
                    if(response === ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }else if(response === ERR_NOT_ENOUGH_RESOURCES){
                        creep.room.memory.assignments[creep.name].x = -1;
                        creep.room.memory.assignments[creep.name].y = -1;
                        creep.memory.job = "empty";
                    }else if(response === 0){
                        //Operation completed successfully
                    }else{
                        creep.room.memory.assignments[creep.name].x = -1;
                        creep.room.memory.assignments[creep.name].y = -1;
                        if(creep.store.getUsedCapacity() > 0){
                            creep.memory.job = "empty";
                        }
                    }
                    break;
                case "upgrade":
                    response = creep.upgradeController(creep.room.controller);
                    if(response === ERR_NOT_IN_RANGE){
                        creep.moveTo(creep.room.controller);
                    }else if(response === ERR_NOT_ENOUGH_RESOURCES){
                        creep.room.memory.assignments[creep.name].x = -1;
                        creep.room.memory.assignments[creep.name].y = -1;
                        creep.memory.job = "empty";
                    }
                    break;
                
              }
        }else{
            creep.say("assigning");
            let assignment = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter:function(o){ 
                let claimed = false;
                let keys = Object.keys(creep.room.memory.assignments);
                for(const key of keys){
                    let claim = creep.room.memory.assignments[key];
                    if (claim['x'] === o.pos.x){
                        if(claim['y'] === o.pos.y){
                            claimed = true;
                        }
                    }
                }
                return (([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER].includes(o.structureType)) && o.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && !(claimed));
            }});
            creep.memory.job = "transfer";
            if(_.isNull(assignment)){
                assignment = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {filter:function(o){ 
                    let claimed = false;
                    let keys = Object.keys(creep.room.memory.assignments);
                for(const key of keys){
                    let claim = creep.room.memory.assignments[key];
                        if (claim['x'] === o.pos.x){
                            if(claim['y'] === o.pos.y){
                                claimed = true;
                            }
                        }
                    }
                    return !(claimed);
                }});
                creep.memory.job = "build";
            }
            if(_.isNull(assignment)){
                assignment = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter:function(o){
                    let claimed = false;
                    let keys = Object.keys(creep.room.memory.assignments);
                    for(const key of keys){
                        let claim = creep.room.memory.assignments[key];
                        if (claim['x'] === o.pos.x){
                            if(claim['y'] === o.pos.y){
                                claimed = true;
                            }
                        }
                    }
                    return !(claimed) && o.hits < o.hitsMax && o.room === creep.room;
                }});
                creep.memory.job = "repair";
            }
            if(_.isNull(assignment)){
                creep.memory.job = "upgrade";
                creep.room.memory.assignments[creep.name].x = 0;
                creep.room.memory.assignments[creep.name].y = 0;
            }else{
                creep.room.memory.assignments[creep.name].x = assignment.pos.x;
                creep.room.memory.assignments[creep.name].y = assignment.pos.y;
            }
        }
        
        
    },
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker' && creep.room.name == room.name);
        console.log('Workers: ' + workers.length, room.name);

        if (workers.length < config.workerCount) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Worker' + Game.time;
            let body = [WORK, CARRY, MOVE];
            let memory = {role: 'worker', job: 'new'};
        
            return {name, body, memory};
    }
};

module.exports = roleWorker;