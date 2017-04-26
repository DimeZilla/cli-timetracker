'use strict';
var exports = module.exports = {};

var model = require('../models/include.js');
var columnify = require('columnify');
var _ = require('underscore-node');
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
	let passData = {};
	passData.date = new Date();
	
	if(args.hasArg('date')){
		passData.date = new Date(args.getArg('date'));
	}
	
	if(args.hasArg('groupby')){
		passData.groupby = args.getArg('groupby');
		if(args.hasArg('and')){
			passData.and = args.getArg('and');
		}
	}

	var data = model.analyze(passData);
	if(_.isEmpty(data)){
		console.log("There are no timers for this date");
	}else{

		console.log(columnify(data));
	}
};