'use strict';
var helpers =require('./helpers.js');
var fileSystem = require('./directories.js');
var _ = require('underscore-node');

function Tasks(){

    let projectsFile = fileSystem.projectsFile,
        tasksFile = fileSystem.tasksFile,
        projects = helpers.parseFile(projectsFile),
        tasks = helpers.parseFile(tasksFile);

    /*
     * resets the instance data stores
     */
    function _flushProjectsCache(){
        projects = helpers.parseFile(projectsFile);
    }
    
    function _flushTasksCache(){
        tasks = helpers.parseFile(tasksFile);
    }

    function _flushDataCache(){
        _flushProjectsCache();
        _flushTasksCache();
    }

    function _projectExists(key, value){
        return helpers.rowExists(key, value, projects );
    }

    function _taskExists(key, value){
        return helpers.rowExists(key, value, tasks );
    }

    /*
     * @param args {object} requires key name and accepts optional keys billable and description
     */
    function addTask(args){
        let name, description, billable;
        if(args.hasOwnProperty('name')){
            name = args.name;
        }else{
            return false;
        }
        if(args.hasOwnProperty('billable')) billable = args.billable;
        if(args.hasOwnProperty('description')) description = args.description;

        var uid = helpers.getUID(name),
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

        tasks.push(newTask);
        if(tasks.length === 0){
            return false;
        }
        helpers.writeToFile(tasksFile, tasks);

        return true;
    }

    /*
     * @param proj {string} = uid of a project row
     * @pram tas {string} = uid of a task row
     */
    function setProjectTask(args){
        let proj = args.hasOwnProperty('proj') ? args.proj : false, 
            tas = args.hasOwnProperty('tas') ? helpers.getUID(args.tas) : false, 
            uid = args.hasOwnProperty('uid') ? args.uid : false;
        
        _flushDataCache();

        if(proj === false){
            console.error("Project required.");
            return false;
        }
        if(tas === false){
            console.error("Task required");
            return false;
        }

        var projExists = (uid)? _projectExists('uid',proj) : _projectExists('name',proj);
        
        if(  !projExists  ){
            console.log("Couldn't find the project: ", proj );
            return false;
        }

        var taskExists = _taskExists('uid', tas);
        if( !taskExists ){
            console.error("Couldn't find the task: ", tas);
            return false;
        }
        
        if(!uid){
            var dupes = _.where(projects, {'name': proj});
            if(dupes.length > 1){
                console.error("ERROR: There are multiple projects with name " + proj + ". Please submit again using the uid (unique id) of the project. Use \">timelog list projects\" to get the uid.");
                console.log("To submit with the uid use ");
                console.log(">timelog [assign | unassign] <task name> to --uid <uid>");
                return false;
            }
            proj = helpers.getUID(proj);
        }

        var task = helpers.getUID(tas);

        for(var i = 0; i < projects.length; i++ ){
            if(projects[i].uid == proj){
                if(typeof projects[i].tasks === 'undefined' || !_.isArray( projects[i].tasks ) ){
                    projects[i].tasks = [];
                }
                
                if(projects[i].tasks.indexOf(tas) === -1){
                    projects[i].tasks.push(tas);
                    helpers.writeToFile(projectsFile, projects);
                    return true;    
                }else{
                    console.error("Task already assign to project");
                }
                
            }
        }
        console.log("something else went terrible wrong");
        return false;
    }

    function removeProjectTask(args) {
        let proj = args.hasOwnProperty('proj') ? args.proj : false, 
            tas = args.hasOwnProperty('tas') ? args.tas : false, 
            uid = args.hasOwnProperty('uid') ? args.uid : false;

        _flushDataCache();

        if(proj === false){
            console.error("Project required.");
            return false;
        }
        if(tas === false){
            console.error("Task required");
            return false;
        }

        var projExists = (uid)? _projectExists('uid',proj, projects) : _projectExists('name',proj, projects);

        if(!uid){
            var dupes = _.where(projects, {'name': proj});
            if(dupes.length > 1){
                console.error("ERROR: There are multiple projects with name " + proj + ". Please submit again using the uid (unique id) of the project. Use \">timelog list projects\" to get the uid.");
                console.log("To submit with the uid use ");
                console.log(">timelog [assign | unassign] <task name> to --uid <uid>");
                return false;
            }
            proj = helpers.getUID(proj);
        }

        var task = helpers.getUID(tas);

        for(var i = 0; i < projects.length; i++ ){
            if(projects[i].uid == proj){
                if(typeof projects[i].tasks === 'undefined' || !_.isArray( projects[i].tasks ) ){
                    projects[i].tasks = [];
                }
                
                projects[i].tasks = _.reject(projects[i].tasks, (task) => { return task == tas; });
                helpers.writeToFile(projectsFile, projects);
                return true;
            }
        }
        console.error("Could not find the task in the project's task list");
        return false;
    }
    return Object.freeze({ _taskExists, addTask, setProjectTask, removeProjectTask });
}

module.exports = Tasks();