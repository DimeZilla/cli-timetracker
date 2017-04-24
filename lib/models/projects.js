#!/usr/bin/env node
'use strict';

var fileSystem = require('./directories.js');
var helpers = require('./helpers.js');
var _ = require('underscore-node');

var exports = module.exports = (function(){
    var file = fileSystem.projectsFile, 
        data = helpers.parseFile(fileSystem.parojectsFile);
        

    var findProject = function(key, value){
        return helpers.rowExists(key, value, data);
    };

    var checkProjectHasTask = function(projKey, projValue, taskUID){
        var rows = _.where(data, {projKey : projValue});
        if(rows.length > 1){
            console.log("Please specify which project by using the UID");
        }else{
            return (!_.isEmpty(rows))? rows[0].tasks.indexOf(taskUID) > -1 : false;
        }
    };

    var addProject = function(name, description){
        var projects = data,
            uid = helpers.getUID(name),
            newProj = {
                'uid' : uid,
                'name' : name,
                'description' : description || '',
                'tasks' : []
            };

        var dupes = _.where(projects, { 'uid' : uid });
        if(dupes.length > 0){
            newProj.uid = uid + (dupes.length + 1);
        }


        console.log('adding ' + name + ' to our project list');

        projects.push(newProj);
        
        helpers.writeToFile(file, projects);
    };
    
    return {
        'addProject' : addProject,
        'checkProjectHasTask' : checkProjectHasTask,
        'findProject' : findProject
    };

})();

