#!/usr/bin/env node
'use strict';
var helpers =require('./helpers.js');
var fileSystem = require('./directories.js');
var _ = require('underscore-node');

var exports = module.exports = {};
exports.findTask = function(key, value){
    return helpers.rowExists(key, value, helpers.parseFile(fileSystem.tasksFile) );
};

exports.addTask = function(name, description, billable){
        var tasks = helpers.parseFile(fileSystem.tasksFile),
            uid = helpers.getUID(name),
            newTask = {
                'uid' : uid,
                'name' : name,
                'description' : description || '',
                'billable': billable || false
            };

        var dupes = _.where(tasks, { 'uid' : uid } );
        if(dupes.length){
            newTask.uid = uid + (dupes.length + 1);
        }

        console.log('adding ' + name + ' to our task list.');
        tasks.push(newTask);
        helpers.writeToFile(tasksFile, tasks);
};


/*
 * @param proj {string} = uid of a project row
 * @pram tas {string} = uid of a task row
 */
exports.setProjectTask = function(proj, tas, uid){
    var projects = helpers.parseFile(fileSystem.projectsFile);

    var projExists = (uid)? helpers.rowExists('uid',proj, projects) : helpers.rowExists('name',proj, projects);
    if(  !projExists || !helpers.rowExists('uid', tas, helpers.parseFile(fileSystem.tasksFile)) ){
        console.log("one of these does not exist");
        return false;
    }

    
    if(!uid){
        var dupes = _.where(projects, {'name': proj});
        if(dupes.length > 1){
            console.error("ERROR: There are multiple projects with name " + proj + ". Please submit again using the uid (unique id) of the project. Use \">timelog list projects\" to get the uid.");
            console.log("To submit with the uid use ");
            console.log(">timelog [assign | unassign] <task name> to --uid <uid>");
            process.exit(1);
        }
        proj = getUID(proj);
    }

    var task = getUID(tas);

    for(var i = 0; i < projects.length; i++ ){
        if(projects[i].uid == proj){
            if(typeof projects[i].tasks === 'undefined' || !_.isArray( projects[i].tasks ) ){
                projects[i].tasks = [];
            }
            
            if(projects[i].tasks.indexOf(tas) === -1){
                projects[i].tasks.push(tas);
                helpers.writeToFile(fileSytem.projectsFile, projects);
                console.log("Success! " + tas + " added to " + proj);
                return true;    
            }else{
                console.error("Task already assign to project");
            }
            
        }
    }
};

exports.removeProjectTask = function(proj, tas, uid) {
    var projects = parseFile(fileSytem.projectsFile);

    var projects = parseFile(fileSytem.projectsFile);

    var projExists = (uid)? rowExists('uid',proj, projects) : rowExists('name',proj, projects);

    if(!uid){
        var dupes = _.where(projects, {'name': proj});
        if(dupes.length > 1){
            console.error("ERROR: There are multiple projects with name " + proj + ". Please submit again using the uid (unique id) of the project. Use \">timelog list projects\" to get the uid.");
            console.log("To submit with the uid use ");
            console.log(">timelog [assign | unassign] <task name> to --uid <uid>");
            process.exit(1);
        }
        proj = getUID(proj);
    }

    var task = getUID(tas);

    for(var i = 0; i < projects.length; i++ ){
        if(projects[i].uid == proj){
            if(typeof projects[i].tasks === 'undefined' || !_.isArray( projects[i].tasks ) ){
                projects[i].tasks = [];
            }
            
            projects[i].tasks = _.reject(projects[i].tasks, (task) => { return task == tas; });
            console.log("Success! " + tas + " removed from " + proj);
            console.log(projects[i].tasks);
            writeToFile(fileSytem.projectsFile, projects);
            return true;
        }
    }

};