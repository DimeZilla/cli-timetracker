#!/usr/bin/env node
'use strict';
var exports = module.exports = {};

var model = require('../models/model.js');

// timelog update <task|project> [name] --data
var Updater = function(args){

	var valCheck = function(val){
		return (typeof val === 'undefined' || val === "");
	};

	var type = args.getPos(1), name = args.getPos(2);

	if(valCheck(type) || (type.toLowerCase() !== "project" && type.toLowerCase() !== "task") ){
		console.error("Please specify whether we are updateing a task or a project");
		process.exit(1);
	}
	if(valCheck(name)){
		console.error("Please specify the name of the project or task to update");
		process.exit(1);
	}

	var data = {};
	var assignArg = function(arg){
		if(args.hasArg(arg)){
			data[arg] = args.getArg(arg);
		}
	}
	var checks = ['description', 'name','billable'];
	for(var i = 0; i < checks.length; i++){
		assignArg(checks[i]);
	}
	type = type.toLowerCase();
	var mtype = type == 'project' ? 'p' : 't';

	console.log(mtype, name, data);
	var ret = model.update(mtype, name, data);
	if(!ret){
		console.error("Something went wrong. Please check your inputs and try again");
	}else {
		console.log("Success! list the project of task to make sure it worked");
	}
};

exports._ = function(args){
	Updater(args);
};