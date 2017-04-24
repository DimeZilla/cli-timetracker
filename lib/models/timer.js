#!/usr/bin/env node
'use strict';

var helpers = require('./helpers.js');
var fileSystem = require('./directories.js');
var projects = require('./projects.js');
var tasks = require('./tasks.js');
var _ = require('underscore-node');

var exports = module.exports = {};
exports.start = function(args){
	var logData = helpers.parseFile(fileSystem.logData);
	if(_.isEmpty(logData)){
		logData = {};
	}else {
		console.error("Yo currently have a running timer. Please stop your timer before starting a new one.");
	}

	logData.startTime = + new Date();
	var task = false;
	if(args.hasArg('task')){
		logData.task = helpers.getUID(args.getArg('task'));
		console.log("task: ", tasks.findTask('uid', logData.task));
		task = true;
	}

	if(args.hasArg('project')){
		logData.project = args.getArg('project');

		console.log('project: ', projects.findProject('uid', logData.project));
		if(task){
			console.log('project has task', projects.checkProjectHasTask('name', logData.project, logData.task));
		}
	}

	if(args.hasArg('description')){
		logData.description = args.getArg('description');
	}

	helpers.writeToFile(fileSystem.logData, logData);
	console.log(this.checkStatus());
};


exports.stop = function(args){
	var logData = helpers.parseFile(fileSystem.logData);
	logData.stopTime = + new Date();

	if(args.hasArg('distract') || args.hasPos(1)){
		// trying to stop a distract
		console.log("Distract not yet supported");
		return false;
	}
	// we'll our data to the compiled log and then we'll erase our tmp log file
	var compiledLog = helpers.parseFile(fileSystem.compiledLogDataFile);
	compiledLog.push(logData);
	
	helpers.writeToFile(fileSystem.compiledLogDataFile, compiledLog);

	// right now we will just delete the file
	helpers.writeToFile(fileSystem.logData, '');
};

exports.checkStatus = function(args){
	var logData = helpers.parseFile(fileSystem.logData);
	if(_.isEmpty(logData)){
		return false;
	}

	logData.ellapsed_time = helpers.getHours(+ new Date(),  logData.startTime);
	logData.startTime = new Date(logData.startTime);

	return logData;
};

exports.analyze = function(date){
	var logData = helpers.parseFile(fileSystem.logData);
	var compLog = helpers.parseFile(fileSystem.compiledLogDataFile);

	try {
		date = helpers.isoDate(date);
	}catch(e){
		console.error(e);
		process.exit(1);
	}

	compLog.push(logData);
	var newData = _.filter(compLog, (row) => {return helpers.isoDate(new Date(row.startTime)) == date; } );
	if(_.isEmpty(newData)){
		return false;
	}
	for(var i = 0; i < newData.length; i++){
		var row = newData[i];
		row.ellapsed_time = helpers.getHours(row.stopTime, row.startTime);
		row.startTime = helpers.fullDateString(new Date(row.startTime));
		row.stopTime = helpers.fullDateString(new Date(row.stopTime));
	}
	return newData;
};