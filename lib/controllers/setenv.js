'use strict';

const model = require('../models/include.js');
const columnify = require('columnify');

function SetEnv(){

  // timelog open --project "<project name>" --task "<task name>"
  // timelog open project <project name> task <task name>
  function open(args){
    let data = {};
    if(args.hasArg('project') || args.hasArg('task')){
      data.project = args.hasArg('project') ? args.getArg('project') : null;
      data.project = args.hasArg('task') ? args.getArg('task') : null;
    }else{
      let projpos = args.getValuePos('project'),
          taskpos = args.getValuePos('task');

      data.project = projpos > -1 ? args.getPos(projpos + 1) : null;
      data.task = taskpos > -1 ? args.getPos(taskpos + 1) : null;
    }
    if(args.hasArg('description')){
      data.description = args.getArg('description');
    }
    return __setenv(data);
  }

  function __setenv(data){
    let ret = model.setEnv(data);
    if(ret){
      let message = 'Openning: ';
      if(data.hasOwnProperty('project')){
        message += 'project -' + data.project + ' ';
      }
      if(data.hasOwnProperty('task') && data.task !== null){
        message += 'task - ' + data.task;
      }
      console.log(message);
    }else{
      console.error("something went terrible wrong");
    }
    return ret;
  }

  function close(){
    let ret = model.closeEnv();
    if(!ret){
      console.log("Couldn't close the project");
    }
    console.log("Environment closed");
    console.log("stopping timer");
    model.stop({});
    return true;
  }

  return {open, close};
}

module.exports = SetEnv();