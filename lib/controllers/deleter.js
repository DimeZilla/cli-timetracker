'use strict';
var exports = module.exports = {};

var model = require('../models/include.js');
// timelog delete [task|project] <task|project name|uid>
var Deleter = function(args){
	let type = args.getPos(1), name, ret = false;

	if(typeof type !== 'undefined' && type !== ""){
		name = (args.hasArg('name'))? args.getArg('name') : args.getPos(2);
	}else {
		if(args.hasArg('project')){
			type = 'p';
			name = args.getArg('project');

		}else if(args.hasArg('task')){
			type = 't';
			name = args.getArg('task');
			
		}
	}

	if(typeof name === 'undefined' || name == ""){
		console.error("Must specify a project or task name");
		return false;
	}

	ret = model.deleteProjectOrTask({'type': type, 'name': name});
	if(ret){
		console.log("Success: " + name + " " + type+ " deleted");
	}else{
		console.log("Sorry, something went wrong for " + type + " " + name);
	}
	return ret;
	
};


exports._ = function(args){
	Deleter(args);
};