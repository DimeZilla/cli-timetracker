#!/usr/bin/env node
'use strict';
/*
 * This will compile our models and send them out
 */

var _ = require('underscore-node');
var readline = require('readline');

var fileSystem = require('./directories.js');
var helpers = require('./helpers.js');
var projects = require('./projects.js');
var tasks = require('./tasks.js');
var time = require('./timer.js');

var exports = module.exports = (function(){

    var update = function(type, name, data){
        
        if( _.isEmpty(type) || _.isEmpty(name) || _.isEmpty(data)){
            return false;
        }
        
        var uid = helpers.getUID(name), file;
        if(type == 'p'){
            file = fileSystem.projectsFile;
        }else if (type == 't'){
            file = fileSystem.tasksFile;
        }else{  
            console.error("Wrong data type!");
            return false;
        }

        var oldData = helpers.parseFile(file);

        if( !_.isEmpty(data.uid) ){
            var nuid = helpers.getUID(data.uid),
                dupes = _.where(oldData, {'uid': nuid});
            if(dupes.length > 0){
                console.error("Can't change the unique id: a " + ((type == 'p')? 'project' : 'task') + " with the name " + data.name + " already exists" );
                process.exit(1);
            }else{
                data.uid = nuid;
            }
        }
        
        for(var i = 0; i < oldData.length; i++){
            var row = oldData[i];
            if(row.uid == uid){
                for(var key in row){
                    if(key in data){
                        row[key] = data[key];
                    }
                }
                helpers.writeToFile(file, oldData);
                return true;
            }
        }

        return false;
    };

    var deleteProjectOrTask = function(type, name){
        if(_.isEmpty(type) || _.isEmpty(name)){
            return false;
        }

        var file, uid = getUID(name);
        if(type == 'p'){
            file = projectsFile;
        }else if (type == 't'){
            file = tasksFile;
        }else{  
            return false;
        }

        var reject = false, list = parseFile(file);
        var newList = _.reject(list, function(item){
            if(item.uid == uid){
                reject = true;
            }
            return item.uid == uid;
        });

        if(reject){
            helpers.writeToFile(file, newList);    
        }
        
        return reject;
    };

    var listData = function(type,name){
        var file = (type == 'p')? fileSystem.projectsFile : fileSystem.tasksFile;
        var projects = helpers.parseFile(file);
        
        if(typeof name !== 'undefined' && !_.isEmpty(name) ){
            projects = _.where(projects, { 'uid' : getUID(name) });
        }
        
        if(!_.isEmpty(projects)){
            return projects;
        }else{
            var type = (type == 'p')? 'Projects' : 'Tasks';
            return "No " + type + " Registered Yet";
        } 
    };
    
    /*
     * We have some generic functions above but basically this will compile all of our functions from our requirements and send them up to the rest of the app.
     * 
     */
    var up = function(){
        var ourmods = {
            'update': update,
            'deleteProjectOrTask': deleteProjectOrTask,
            'listData': listData,
        };

        var reqs = [helpers, projects, tasks, time];
        for(var i = 0; i < reqs.length; i++){
            for(var key in reqs[i]){
                ourmods[key] = reqs[i][key];
            }    
        }
        
        return ourmods;
    };

    return up();

})();
