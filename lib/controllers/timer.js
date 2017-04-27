'use strict';

var model = require('../models/include.js');
var columnify = require('columnify');
var _ = require('underscore-node');
// timelog start [options: --project <project name | uid> --task <task name | uid> --description "<description>"]
// timelog start [w/o options] - starts a generic timer with no task
// timelog stop
// timelog distract [options: --project <project name | uid> --task <task name | uid> --description "<description>"]


function Timer(){

  var env = model.parseFile(model.currProjectFile);

  function _getStartData(args){
    let logData = {},
        task,
        project;

    if(args.hasArg('task') || args.hasArg('project')){
      task = args.getArg('task');
      project = args.getArg('project');
    }else{
      let projpos = args.getValuePos('project'),
          taskpos = args.getValuePos('task');

      project = projpos > -1 ? args.getPos(projpos + 1) : null;
      task = taskpos > -1 ? args.getPos(taskpos + 1) : null;
    }

    if(!_.isEmpty(project)) logData.project = project;
    if(!_.isEmpty(task)) logdata.task = task;
    return logData;
  }
  
  function start(args){
    let data = _getStartData(args);
    if(_.isEmpty(data) && !_.isEmpty(env)){
      data = env;  
    }
    // putting description here so that I can keep the environment variables but change the description on the fly
    if(args.hasArg('description')){
        data.description = args.getArg('description');
    }
    console.log(data);
    data.startTime = + new Date();
    let ret = model.start(data);
    if(!ret){
      console.log("Something went wrong. Couldn't start timer.");
    }
    return ret;
  }

  function stop(args){
    model.stop(args);
  }

  function distract(args){
    model.distract(args);
  }

  /* 
   * check the status of the timer 
   * timelog status
   * returns the current project, task, start time, ellapsed time and whether or not we are in distract mode
   */
  function status(){
    if(!_.isEmpty(env)){
      console.log("Currently in the following environment:");
      console.log(columnify(env));
      console.log(" ");  
    }
    
    var ret = model.checkStatus();
    if(ret === false){
      console.log("You currently do not have any timers running");
    }else{
      console.log(columnify(ret));
    }
  }


  /* 
   * analyze the time we've spend 
   * timelog analyze <today | date> - defaults to today
   */
  function analyze(args){
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

      console.log(columnify(data, {config: { description: {maxWidth: 30}}}));
    }
  }

  return {start, stop, distract, status, analyze};
}

module.exports = Timer();
