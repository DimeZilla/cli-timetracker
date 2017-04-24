#!/usr/bin/env node
'use strict';
var exports = module.exports = {};

var model = require('../models/model.js');
var columnify = require('columnify');

// timelog start [options: --project <project name | uid> --task <task name | uid> --description "<description>"]
// timelog start [w/o options] - starts a generic timer with no task
// timelog stop
// timelog distract [options: --project <project name | uid> --task <task name | uid> --description "<description>"]
// timelog stop distract
exports._ = function(action, args){
	if(action == 'start'){
		model.start(args);
	}
	if(action == 'stop'){
		model.stop(args);
	}
	if(action == 'distract'){
		model.distract(args);
	}

};

/* 
 * check the status of the timer 
 * timelog status
 * returns the current project, task, start time, ellapsed time and whether or not we are in distract mode
 */
exports.status = function(){
	var ret = model.checkStatus();
	if(ret === false){
		console.log("You currently do not have any timers running");
	}else{
		console.log(columnify(ret));
	}
};

/* 
 * analyze the time we've spend 
 * timelog analyze <today | date> - defaults to today
 */
exports.analyze = function(args){
	var  date = new Date();
	if(args.hasPos(1) || (args.getPos(1) !== undefined && args.getPos(1).toLowerCase() !== 'today') ){
		date = new Date(args.getPos(1));
	}else if(args.hasArg('date')){
		date = new Date(args.getArg('date'));
	}


	var data = model.analyze(date);
	if(data === false){
		console.log("There are no timers for this date");
	}else{
		console.log(columnify(data));
	}
};