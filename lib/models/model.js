/*
 * This will constrict how we store data in the program
 */
'use strict';

var fs = require('fs');
var path = require('path');
var home = require('os').homedir();
var _ = require('underscore-node');
var readline = require('readline');

var exports = module.exports = {};
exports.model = {
    'dir' : home + path.sep + '.timelog' + path.sep + 'appData' + path.sep,
    'projects' : 'projects.json',
    'tasks' : 'tasks.json'
};

exports.projectsFile = exports.model.dir + exports.model.projects;
exports.tasksFile = exports.model.dir + exports.model.tasks;
exports.dataDir = exports.model.dir;

// tries to parse the output and if fails returns an empty object
exports.parseFile = function(file){
    var obj;
    try {
        obj = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch(e){
        obj = [];
    }
    
    return obj;
};

exports.writeToFile = function(file, data){
    fs.writeFileSync(file, JSON.stringify(data),'utf8');
};
exports.getUID = function(str){
    return str.replace(/\s+/g,'-').toLowerCase();
};

exports.addProject = function(name, description){
    var projects = this.parseFile(this.projectsFile),
        uid = this.getUID(name),
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
    if(this.debug){
        console.log(projects);
    }
    
    this.writeToFile(this.projectsFile, projects);
 
};

exports.addTask = function(name, description, billable){
    var tasks = this.parseFile(this.tasksFile),
        uid = this.getUID(name),
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
    this.writeToFile(this.tasksFile, tasks);
};

exports.update = function(type, name, data){
    
    if( _.isEmpty(type) || _.isEmpty(name) || _.isEmpty(data)){
        return false;
    }
    
    var uid = this.getUID(name), file;
    if(type == 'p'){
        file = this.projectsFile;
    }else if (type == 't'){
        file = this.tasksFile;
    }else{  
        console.error("Wrong data type!");
        return false;
    }

    var oldData = this.parseFile(file);

    if( !_.isEmpty(data.uid) ){
        var nuid = this.getUID(data.uid),
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
            this.writeToFile(file, oldData);
            return true;
        }
    }

    return false;
};

exports.deleteProjectOrTask = function(type, name){
    if(_.isEmpty(type) || _.isEmpty(name)){
        return false;
    }

    var file, uid = this.getUID(name);
    if(type == 'p'){
        file = this.projectsFile;
    }else if (type == 't'){
        file = this.tasksFile;
    }else{  
        return false;
    }

    var reject = false, list = this.parseFile(file);
    var newList = _.reject(list, function(item){
        if(item.uid == uid){
            reject = true;
        }
        return item.uid == uid;
    });

    if(reject){
        this.writeToFile(file, newList);    
    }
    
    return reject;
};

exports.listData = function(type,name){
    var file = (type == 'p')? this.projectsFile : this.tasksFile;
    var projects = this.parseFile(file);
    
    if(typeof name !== 'undefined' && !_.isEmpty(name) ){
        projects = _.where(projects, { 'uid' : this.getUID(name) });
    }
    
    if(!_.isEmpty(projects)){
        return projects;
    }else{
        var type = (type == 'p')? 'Projects' : 'Tasks';
        return "No " + type + " Registered Yet";
    } 
};

function rowExists(key,value,data){
    var tmp = {}; 
        tmp[key] = value;
    var ar = _.where(data, tmp );
    return ar.length > 0 ? true : false;
}

/*
 * @param proj {string} = uid of a project row
 * @pram tas {string} = uid of a task row
 */
exports.setProjectTask = function(proj, tas, uid){
    var projects = this.parseFile(this.projectsFile);

    var projExists = (uid)? rowExists('uid',proj, projects) : rowExists('name',proj, projects);
    if(  !projExists || !rowExists('uid', tas, this.parseFile(this.tasksFile)) ){
        console.log("one of these does not exist");
        return false;
    }

    
    if(!uid){
        var dupes = _.where(projects, {'name': proj});
        if(dupes.length > 1){
            console.error("ERROR: There are multiple projects with name " + proj + ". Please submit again using the uid (unique id) of the project. Use \">timelog list projects\" to get the uid.");
            console.log("To submit with the uid use ");
            console.log(">timelog assign <task name> to --uid <uid>");
            process.exit(1);
        }
        proj = this.getUID(proj);
    }

    var task = this.getUID(tas);

    for(var i = 0; i < projects.length; i++ ){
        if(projects[i].uid == proj){
            if(typeof projects[i].tasks === 'undefined' || !_.isArray( projects[i].tasks ) ){
                projects[i].tasks = [];
            }
            
            if(projects[i].tasks.indexOf(tas) === -1){
                projects[i].tasks.push(tas);
                this.writeToFile(this.projectsFile, projects);
                console.log("Success! " + tas " added to " + proj);
                return true;    
            }else{
                console.error("Task already assign to project");
            }
            
        }
    }
};