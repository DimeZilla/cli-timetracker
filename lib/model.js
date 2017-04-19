/*
 * This will constrict how we store data in the program
 */
'use strict';

var fs = require('fs');
var path = require('path');
var home = require('os').homedir();
var _ = require('underscore-node');
var columnify = require('columnify');

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
    fs.writeFile(file, JSON.stringify(data),'utf8');
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
    if(dupes.length){
        console.error(new Error('The project already exists'));
        return false;
    }

    console.log('adding ' + name + ' to our project list');

    projects.push(newProj);
    this.writeToFile(this.projectsFile, projects);
 
};

exports.addTask = function(name, description){
    var tasks = this.parseFile(this.tasksFile),
        uid = this.getUID(name),
        newTask = {
            'uid' : uid,
            'name' : name,
            'description' : description || ''
        };

    var dupes = _.where(tasks, { 'uid' : uid } );
    if(dupes.length){
        console.log(new Error('The Task already exists'));
        return false;
    }

    console.log('adding ' + name + ' to our task list.');
    tasks.push(newTask);
    this.writeToFile(this.tasksFile, tasks);
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
exports.setProjectTask = function(proj, tas){
    var projects = this.parseFile(this.projectsFile);

    if( !rowExists('uid',proj, projects) || !rowExists('uid', tas, this.parseFile(this.tasksFile)) ){
        return false;
    }

    for(var i = 0; i < projects.length; i++ ){
        if(projects[i].uid == proj){
            if(typeof projects[i].tasks === 'undefined' || !_.isArray( projects[i].tasks ) ){
                projects[i].tasks = [];
            }
            projects[i].tasks.push(tas);
            this.writeToFile(this.projectsFile, projects);
            return true;
        }
    }
};
