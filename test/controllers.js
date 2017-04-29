"use strict";
const assert = require('assert');
const model = require('../lib/models/include.js');
const _ = require('underscore-node');

/*
 * 1. create a project
 * 2. create a task
 * 3. assign a task to a project
 * 4. open a project (set environment project)
 * 5. start 
 * 6. stop
 * 7. start a non enviornment project
 * 8. stop
 * 9. delete project
 * 10. delete task
 */
describe("Testing Controller Functions", () => {
  
  let args = {
    'project': 'test-project-123',
    'task': 'test-task-123',
    'description': 'testing a project'
  };

  describe("CREATING OUR PROJECT AND TASK", () => {
    let creator = require('../lib/controllers/creator.js');
    
    describe("1. create a project", () => {
      
      let project = {
        project: args.project,
        description: 'Testing creating a project'
      };
      it('should create the project', () => {
        let ret = creator._(project);
        assert.ok(ret);
      });
    });

    describe("2. create a task", () => {
      let task = {
        project: args.task,
        description: 'Testing creating a task'
      };
      it('should create the project', () => {
        let ret = creator._(task);
        assert.ok(ret);
      });
    });
  });
  

  describe("3. assign a task to a project", () => {

  });

 

  describe("4. open a project (set environment project)", () => {

  });

  describe("5. start ", () => {

  });

  describe("6. stop", () => {

  });

  describe("7. start a non enviornment project", () => {

  });

  describe("8. stop", () => {

  });

  describe("9. delete project", () => {

  });

  describe("10. delete task", () => {

  });

});