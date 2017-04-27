'use strict';
/*
 * An abstracted validation setting for our model to make sure that all times have these data pieces
 * and all environment do as well
 */
var model = require('../models/include.js');

function validate(logData){

  function _runArgs(){
    logData.project = logData.hasOwnProperty('project') ? logData.project : null;
    logData.task = logData.hasOwnProperty('task') ? logData.task : null;
    logData.description = logData.hasOwnProperty('description') ? logData.description : null;
  }

  function _noProjects(){
    return logData.project === '' || logData.project === null;
  }

  function _noTasks(){
    return logData.task === '' || logData.task === null;
  }

  function _validate(){
    _runArgs(logData);

    if( _noProjects() && _noTasks()){
      console.log("No settings to set");
      return false;
    }
    if(!_noProjects()){
      logData.project = model.getUID(logData.project);
      if(!model.findProject('uid', logData.project)){
        console.error('Sorry this project doesn\'t exist. Please enter a valid project.');
        return false;
      }
    }
    if(!_noTasks()){
      logData.task = model.getUID(logData.task);
      if(!model._taskExists('uid', logData.task)){
        console.error('Sorry this task doesn\'t exist. Please enter a valid task.');
        return false; 
      }
    }
    return true;
  }

  if(_validate()){
    return logData;  
  }
  return false;
}


module.exports = validate;
