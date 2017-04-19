#!/usr/bin/env node
var exports = module.exports = {};
/* 
 * this sets up our arguments export that we'll send back to the app 
 */

/* 1. get args */
var args = require('yargs');

/* 2. add options */
var argList = {
    'c' : { alias: ['create'], describe: 'Sets the program to create mode. Requires task or project and optionally accepts a desctiption argument', type: "boolean", default: undefined },
    'p' : { alias: ['project'], describe: 'Project', type: "string" },
    't' : { alias: ['task'], describe: 'Task', type: "string" },
    'l' : { 
            alias: ['list'], 
            describe: 'Sets program to list mode. Requires task or project to tell us what to list and optionally can pass a value to task or project to search the list for a specific task or project name.',
            type: "boolean",
            default: undefined
            },
    'd' : { alias: ['description'], describe: 'When creating a task or project this parameter passes words to describe the project or task.', type: "string" },
    's' : { alias: ['start'], describe: 'Starts the program', type: "boolean", default: undefined },
    'x' : { alias: ['stop'], describe: 'Stops the program', type: "boolean", default: undefined },
    'a' : { alias: ['assign_task'], describe: 'Assign a task to a project. Requires both a project and a task to be declared.', type: "boolean", default: undefined },
    'd' : { alias: ['distract'], describe: 'Stop the current clock and distract with another task or project', type: "boolean", default: undefined },
    'e' : { alias: ['end_distract'], describe: 'Ends the current distracted state', type: 'boolean', default: undefined }
};

args = args.option(argList);

/* set up help */
args = args.help();

/* send up the args */
exports.args = args.argv;

function isset(property){
    if(typeof property !== 'undefined'){
        return true;
    }
    return false;
}
exports.hasArg = function(key){                               
    return isset(this.args[key]);
};                                                            
exports.getArg = function(key){                               
    return this.args[key];              
};

/*                                                                             
 * set up our conflicts                                                        
 * yargs doesn't support what we want to do here so we will do our own looking 
 */                                                                            
var conflict = {                                                               
    'l': ['c','d','s','x','a'],                                                
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
