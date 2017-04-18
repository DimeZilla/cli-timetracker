/*
 * This will constrict how we store data in the program
 */
var fs = require('fs');
var path = require('path');
var home = require('os').homedir();
exports.model = {
    'dir' : home + path.sep + '.timelog' + path.sep + 'appData' + path.sep,
    'projects' : 'projects.json',
    'taks' : 'tasks.json
};
