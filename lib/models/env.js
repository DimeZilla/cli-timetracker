'use strict';
const fileSystem = require('./directories.js');
const helpers = require('./helpers.js');
const _ = require('underscore-node');
const projects = require('./projects.js');
const tasks = require('./tasks.js');
const validate = require('../assets/_validate.js');

function Environment(){
  let file = fileSystem.currProjectFile,
      env = helpers.parseFile(file),
      saveData = {};

  function _flushEnvCache(){
    env = helpers.parseFile(file);
  }


  function setEnv(args){
    saveData = validate(args);
    if(saveData === false){
      console.log("one or more values are wrong");
      return false;
    }

    helpers.writeToFile(file, saveData);
    return true;
  }

  function closeEnv(){
    let ret = helpers.deleteFile(file);
    if(!ret){
      console.error("something went deleting the env file.");
      return ret;
    }

    ret = helpers.createFile(file);
    if(!ret){
      console.error("something went wrong creating the env file");
    }
    return ret;
  }

  return {setEnv, closeEnv};
}

module.exports = Environment();