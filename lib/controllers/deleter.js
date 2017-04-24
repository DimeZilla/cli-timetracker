#!/usr/bin/env node
'use strict';
var exports = module.exports = {};

var model = require('../models/model.js');
// timelog delete [task|project] <task|project name|uid>
var Deleter = function(args){
	var type = args.getPos(1), name, ret;
	console.log(type);
	if(typeof type !== 'undefined' && type !== ""){
		name = args.getPos(2);

		if(typeof name === 'undefined' || name == ""){
			console.log(new Error("Must specify a project or task name"));
			process.exit(1);
		}

		if(type == "project"){
			ret = model.deleteProjectOrTask('p',name);
		}else if(type == "task"){
			ret = model.deleteProjectOrTask('t',name);
		}else{
			console.log(new Error("type not recognized. Are we deleting a task or a project? "));
		}
		if(ret === false){
			console.log(new Error("Something went wrong. Please list tasks or projects to make sure that what you are trying to delete exists."));
			process.exit(1);
		}

		if(ret){
			console.log("Success: " + name + " " + type+ " deleted");
		}else{
			console.log("Sorry, something went wrong for " + type + " " + name);
		}

	}else {
		if(args.hasArg('project')){
			name = args.getArg('project');

			ret = model.deleteProjectOrTask('p', name);
			if(ret == false){
				console.log(new Error("Project " + name + " does not exists"));
			}else{
				console.log("Success: project " + name + " Deleted");
			}
		}
		if(args.hasArg('task')){
			name = args.getArg('task');

			ret = model.deleteProjectOrTask('t', name);
			if(ret == false){
				console.log(new Error("Task " + name + "  does not exists"));
			}else{
				console.log("Success: task " + name + " Deleted");
			}
		}
	}
	
};


exports._ = function(args){
	Deleter(args);
};