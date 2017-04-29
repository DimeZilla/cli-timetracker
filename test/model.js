"use strict";
const assert = require('assert');
const model = require('../lib/models/include.js');
const _ = require('underscore-node');

/* these are our test variables */
const projectname = 'Test Project';
const projectuid = model.getUID(projectname);
const taskname = 'Test Task';
const taskuid = model.getUID(taskname);
const updatedProjectDesc = "An Updated Project Desc.";
const updatedTaskDesc = "An Updated Task Desc.";
const billable = true;

describe('Testing our Model Functions', ()=>{

  describe('Helpers', () => {
      let json = [
              {test: "passing", bool: true, task: "devOps", project: "testing"},
              {test: "writing", bool: true, task: "dev", project: "testing"},
              {test: "passing", bool: false, task: "devOps", project: "testing"},
              {test: "helping", bool: true, task: "dev", project: "testing"},
              {test: "passing", bool: true, task: "devOps", project: "failing"},
              {test: "sleeping", bool: false, task: "dev", project: "failing"},
              {test: "passing", bool: false, task: "devOps", project: "failing"},
          ],
          file = 'test/tmp.json';

      describe('File Operators', () => {
          it('we\'ll pass some json to a temporary file and then we\'ll open that temporary file and retrieve our data.', () => {
              let ret = model.createFile(file);
              assert.ok(ret, 'Couldn\'t create file. might already exists.');
              ret = model.writeToFile(file, json);
              assert.ok(ret, "Couldn't write to file. Might already exists");
              
              let data = model.parseFile(file);
              // now lets delete the data
              ret = model.deleteFile(file);
              assert.deepStrictEqual(json, data);
          });
      });

      describe('Data Operators', ()=> {
          describe('rowExists', () => {
              it('checks to make sure that a row with a key and value pair exists in an array of objects', () => {
                  let check = model.rowExists('test', 'sleeping', json);
                  assert.ok(check, "Couldn't find row with {test: 'sleeping'}");
              });
          });
          describe('Plucking Unique Values', () => {
              it('should be able to take a key and return an array of only the unique values for that key', () => {
                  let check = model.pluckUniqueValues(json, 'project');
                  assert.deepEqual(check, ["failing", "testing"], 
                      "Couldn't establish equality in plucked results. Here are the results: " + check.join(',') + ' != ' + ["failing", "project"].join(',')
                  );
              });
          });
          describe('Plucking Unique Value Pairs', () => {
              it('should be able to take a two keys and return an array of only the unique values pairs ordering the first key first and the second key second', () => {
                  let check = model.pluckUniqueMultipleValues(json, 'project', 'task');
                  assert.deepEqual(check, [
                      [ 'failing', 'dev' ],
                      [ 'failing', 'devOps' ],
                      [ 'testing', 'dev' ],
                      [ 'testing', 'devOps' ]
                  ], "Couldn't establish equality in plucked results.");
              });
          });

          describe('Time Functions', ()=>{
              let startDateStr = '1987-03-09',
                  startDate = new Date(startDateStr);

              describe('isoDate', ()=>{
                  it('should return the value of a date unixtime in YYYY-MM-DD format', ()=>{
                      assert.equal(model.isoDate(startDate, true), startDateStr);
                  });
              });
          });
      });
  });


  /*
   * Tests our model
   *
   */
  describe('Creating Data', () => {
      describe('Create a Project', () => {
          it('should return the boolean true if the project was added correctly', () => {
              let res = model.addProject({ name: projectname, desctiption: "A fun test project." });
              assert.ok(res);
          });
      });
      describe('Create a Task', () => {
          it('should return the boolean true if the task was added correctly', () => {
              let res = model.addTask({ name: taskname, description: "A fun Test Task.", 'billable': !billable });
              assert.ok(res);
          });
      });
  });

  describe('Updating Data', () => {
      describe('Update a Project', () => {
          it('should return the boolean true if the project was updated', () => {
              let res = model.update({
                  type: 'project',
                  name: projectname,
                  data: {
                      description: updatedProjectDesc
                  }
              });
              assert.ok(res);
          });
      });
      describe('Update a Task', () => {
          it('should return the boolean true if the task was updated', () => {
              let res = model.update({
                  type: 'task',
                  name: taskname,
                  data: {
                      description: updatedTaskDesc,
                      'billable': billable 
                  }
              });
              assert.ok(res);
          });
      });
  });

  describe('Assigning Data', () => {
      describe('Assign a Task to a Project', () => {
          it('should return true if a task was properly assigned to a project', () => {
              let res = model.setProjectTask({
                  proj: projectname,
                  tas: taskname,
                  uid: false
              });
              assert.ok(res);
          });
      });
  });

  // tests
  describe('Listing Data', () => {
      
      function listingRes(arg,  valid){
          if(valid){
              it('should return an array of objects representing a list of projects or tasks', () => {
                  let pass = false,
                      projects = model.listData({type: arg});

                      if( _.isArray(projects) ){
                          if(!_.isEmpty(projects) && typeof projects[0] == 'object' ){
                              pass = true;
                          }else if ( _.isEmpty(projects) ){
                              pass = true;
                          }

                      }else{
                          pass = false;
                      }
                  assert.ok( pass );
              });
          }else{
               it('should return an empty array if an invalid argument is passed', () => {
                  let pass = false,
                      projects = model.listData({type: arg});
                  if(_.isEmpty(projects)) pass = true;
                  assert.ok( pass );
              });
          }  
      }

      describe('List Projects', () => {
          listingRes('projects', true);
      });

      describe('List Tasks', () => {
          listingRes('tasks', true);
      });

      describe('List with invalid argument', () => {
         listingRes('flowers', false);
      });
      
  });

  describe('Unassigning Data', () => {
      
      describe('Unassign a Task from a Project', () => {
          it('should return true if a task was properly unassigned from a project', () => {
              let res = model.removeProjectTask({
                  proj: projectname,
                  tas: taskname,
                  uid: false
              });
              assert.ok(res);
          });
      });

  });

  describe('Deleting Data', () => {

      describe('Delete a Task', () => {
          it('should return true if a task was properly deleted', () => {
              let res = model.deleteProjectOrTask({
                  type: 'task',
                  name: taskname
              });
              assert.ok(res);
          });
      });

      describe('Delete a Project', () => {
          it('should return true if a project was properly deleted', () => {
              let res = model.deleteProjectOrTask({
                  type: 'project',
                  name: projectname
              });
              assert.ok(res);
          });
      });

  });

});