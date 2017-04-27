var path = require('path');
var home = require('os').homedir();

function Directories(){
	var dir = home + path.sep + '.timelog' + path.sep,
		dataDir = dir + 'appData' + path.sep,
    currProjectFile = dataDir + 'currProj.json',
		projects = 'projects.json',
		tasks ='tasks.json',
		projectsFile = dataDir + projects,
		tasksFile = dataDir + tasks,
		timelogDir = dataDir + 'logs' + path.sep,
		logData = dir + 'logs.json',
		compiledLogDataFile = dir + 'logData/logs.json';

	return Object.freeze({dir, projects, currProjectFile, projectsFile, tasksFile, dataDir, timelogDir,logData, compiledLogDataFile });

};

module.exports = Directories();