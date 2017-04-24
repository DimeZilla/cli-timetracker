#!/usr/bin/env node
'use strict';

/* 
 * this sets up our arguments export that we'll send back to the app 
 */
var exports = module.exports = {};

/* 1. get args */
var args = require('yargs');

/* 2. add options */
var argList = {
    'create' : { describe: 'Sets the program to create mode. Requires task or project and optionally accepts a desctiption argument', type: "boolean", default: undefined },
    'project' : { describe: 'Project', type: "string" },
    'task' : { describe: 'Task', type: "string" },
    'list' : { 
            describe: 'Sets program to list mode. Requires task or project to tell us what to list and optionally can pass a value to task or project to search the list for a specific task or project name.',
            type: "boolean",
            default: undefined
            },
    'description' : { describe: 'When creating a task or project this parameter passes words to describe the project or task.', type: "string" },
    'start' : { describe: 'Starts the program', type: "boolean", default: undefined },
    'stop' : { describe: 'Stops the program', type: "boolean", default: undefined },
    'assign_task' : { describe: 'Assign a task to a project. Requires both a project and a task to be declared.', type: "boolean", default: undefined },
    'distract' : { describe: 'Stop the current clock and distract with another task or project', type: "boolean", default: undefined },
    'end_distract' : { describe: 'Ends the current distracted state', type: 'boolean', default: undefined },
    'billable' : { describe: 'Option for defining a task. if invoked it meants that the task is billable', type: 'boolean', default: undefined },
    'update' : {  describe: 'Update  a project or a task. must specify the project or the task to update', type: 'boolean', default: undefined }
};

// args = args.option(argList);
args = args.option({
    'debug': { type: "boolean" }
});
/* set up help */
// args = args.help();

/* send up the args */
exports.args = args.argv;

//console.log(args.argv);

function isset(property){
    if(typeof property === 'undefined' || property === "" || property === false){
        return false;
    }
    return true;
}
exports.hasArg = function(key){
    return isset(this.args[key]);
};

exports.getArg = function(key){
    return this.args[key];              
};
exports.getPos = function(pos){
    return this.args._[pos];
};
exports.hasPos = function(pos){
    return isset(this.args._[pos]);
};
exports.getAction = function(){
    return this.getPos(0);
}

/*                                                                             
 * set up our conflicts                                                        
 * yargs doesn't support what we want to do here so we will do our own looking 
 */                                                                            
var conflict = {                                                               
    'l': ['c','d','s','x','a', 'u'],                                                
    's': ['x'],                                                                
    'x': ['s']                                                                 
};
for(var key in conflict){
    if(isset(args.argv[key])){
        for(var i = 0; i < conflict[key].length; i++){
            if(isset(args.argv[conflict[key][i]])){
                console.log(args.argv);
                console.log(new Error("The argument " + key + " is incompatible with the argument " + conflict[key][i] + " for more information, please see --help"));
                process.exit(1);
            }
        }
    }
}                                             
