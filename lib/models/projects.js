'use strict';
var fileSystem = require('./directories.js');
var helpers = require('./helpers.js');
var _ = require('underscore-node');

function Projects(){
    
    var file = fileSystem.projectsFile, 
        data = helpers.parseFile(file);

    function findProject(key, value){
        return helpers.rowExists(key, value, data);
    };

    function checkProjectHasTask(projKey, projValue, taskUID){
        var rows = _.where(data, {projKey : projValue});
        if(rows.length > 1){
            console.log("Please specify which project by using the UID");
        }else{
            return (!_.isEmpty(rows))? rows[0].tasks.indexOf(taskUID) > -1 : false;
        }
    }

    /*
     * main project creator
     * @param args {object} with required key name and optional key description
     */
    function addProject(args){
        let name, description;
        if(args.hasOwnProperty('name')){
            name = args.name;  
        }else{
            return false;
        }

        if(args.hasOwnProperty('descriotion')) description = args.description;

        let uid = helpers.getUID(name),
            newProj = {
                'uid' : uid,
                'name' : name,
                'description' : description || '',
                'tasks' : []
            };

        let dupes = _.where(data, { 'uid' : uid });
        if(dupes.length > 0){
            newProj.uid = uid + (dupes.length + 1);
        }

        data.push(newProj);
        if(data.length === 0){
            return false;
        }
        helpers.writeToFile(file, data);
        return true;
    }
    
    return Object.freeze({addProject, checkProjectHasTask, findProject});

}

module.exports = Projects();

