/*
 * This will compile our models and send them out
 */
 'use strict';
var _ = require('underscore-node');
var fileSystem = require('./directories.js');
var helpers = require('./helpers.js');

function Uncategorized(){
    let projectsFile = fileSystem.projectsFile,
        tasksFile = fileSystem.tasksFile;

    /*
     * Our data update engine
     * @param args {object} required the keys type, name and data. Data should be an object
     */
    function update(args){
        let type = (args.hasOwnProperty('type'))? args.type : false,
            name = (args.hasOwnProperty('name'))? args.name : false, 
            data = (args.hasOwnProperty('data'))? args.data : false;
            
        if(type === false || name === false || data === false){
            console.log("Missing necessary info on what we are updating", args);
            return false;
        }

        let uid = helpers.getUID(name), file;
        if(type == 'p' || type == 'project'){
            file = projectsFile;
        }else if (type == 't' || type == 'task'){
            file = tasksFile;
        }else{  
            return false;
        }

        let oldData = helpers.parseFile(file);

        /*
         * makes sure that we aren't updating our uid to a uid that already exists in this data set
         */
        if( !_.isEmpty(data.uid) ){
            let nuid = helpers.getUID(data.uid),
                dupes = _.where(oldData, {'uid': nuid});
            if(dupes.length > 0){
                console.log("UID already exists");
                return false;
            }else{
                data.uid = nuid;
            }
        }

        /* 
         * hell yes!
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
         */
        var ret = oldData.some(function(row, i, ar){
            if(row.uid == uid){
                for(var key in row){
                    if(key in data){
                        ar[i][key] = data[key];
                    }
                }
                helpers.writeToFile(file, ar);
                return true;
            }
        });

        if(!ret){
            console.log("Couldn't find the data for updating");
        }
        return ret;
    }

    /*
     * Main deletion engine
     * @param args {object} with required keys type and name
     */ 
    function deleteProjectOrTask(args){
        let type = args.hasOwnProperty('type') ? args.type : false,
            name = args.hasOwnProperty('name') ? args.name : false;

        if(type === false || name === false || _.isEmpty(type) || _.isEmpty(name)){
            console.log('both type of data and name of data are required for proper deletion');
            return false;
        }

        let file, uid = helpers.getUID(name);
        if(type == 'p' || type == "project"){
            file = projectsFile;
        }else if (type == 't' || type == "task"){
            file = tasksFile;
        }else{  
            return false;
        }

        let reject = false, list = helpers.parseFile(file);
        let newList = _.reject(list, function(item){
            if(item.uid == uid){
                reject = true;
            }
            return item.uid == uid;
        });

        if(reject){
            helpers.writeToFile(file, newList);    
        }
        
        return reject;
    }

    /*
     * Takes an object with name and type as values
     *  returns an object - should return an empty object if bad values
     */
    function listData(obj){
        let type, name;
        if(obj.hasOwnProperty('type')) type = obj.type.toLowerCase();
        if(obj.hasOwnProperty('name')) name = obj.name;

        if(type == undefined){
            return {};
        }

        let file;
        if(type == 'projects' || type == 'p' ){
            file = projectsFile;
        }else if(type == 'tasks' || type == 't'){
            file = tasksFile;
        }else{
            return {};
        }

        let projects = helpers.parseFile(file);

        if(typeof name !== 'undefined' && !_.isEmpty(name) ){
            projects = _.where(projects, { 'uid' : helpers.getUID(name) });
        }

        return projects;
    }

    return Object.freeze({
        update,
        deleteProjectOrTask,
        listData
    });

}

module.exports = Uncategorized();
