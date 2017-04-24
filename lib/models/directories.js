#!/usr/bin/env node
'use strict';

var path = require('path');
var home = require('os').homedir();

var exports = module.exports = (function(){
	var dir = home + path.sep + '.timelog' + path.sep,
		dataDir = dir + 'appData' + path.sep,
		projects = 'projects.json',
		tasks ='tasks.json',
		projectsFile = dataDir + projects,
		tasksFile = dataDir + tasks,
		timelogDir = dataDir + 'logs' + path.sep,
		logData = dir + 'logs.json',
		compiledLogDataFile = dir + 'logData/logs.json';

	return {
		'dir': dir,
		'projects': projects,
		'projectsFile': projectsFile,
		'tasksFile': tasksFile,
		'dataDir': dataDir,
		'timelogDir' : timelogDir,
		'logData' : logData,
		'compiledLogDataFile': compiledLogDataFile
	}
})();

