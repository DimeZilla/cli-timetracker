'use strict';

const helpers = require('./helpers.js');
const fileSystem = require('./directories.js');
const projects = require('./projects.js');
const tasks = require('./tasks.js');
const _ = require('underscore-node');
const validate = require('../assets/_validate.js');

function Timer(){
	
	let logDataFile = fileSystem.logData,
		compiledLogDataFile = fileSystem.compiledLogDataFile,
		logData = helpers.parseFile(logDataFile),
		compLog = helpers.parseFile(compiledLogDataFile);

	function _flushLogDataCache(){
		logData = helpers.parseFile(logDataFile);
		compLog = helpers.parseFile(compiledLogDataFile);
    envData = helpers.parseFile(fileSystem.currProjectFile);
	}

	function start(data){
		// if our log data isn't empty we aren't ready
		if(!_.isEmpty(logData)){
			console.error("Yo currently have a running timer. Please stop your timer before starting a new one.");
      return false;
		}

    logData = validate(data)
    if(logData === false){
      console.error('start data failed validation');
      return false;
    }
		helpers.writeToFile(logDataFile, logData);
		console.log(checkStatus());
    return true;
	}

	function stop(args){
		
		logData.stopTime = + new Date();

		if(typeof args !== undefined && args.hasArg('distract') || args.hasPos(1)){
			// trying to stop a distract
			console.log("Distract not yet supported");
			return false;
		}
		// we'll our data to the compiled log and then we'll erase our tmp log file
		var compiledLog = helpers.parseFile(compiledLogDataFile);
		compiledLog.push(logData);
		
		helpers.writeToFile(compiledLogDataFile, compiledLog);

		// right now we will just delete the file
		helpers.writeToFile(logDataFile, '');
	}

	 function checkStatus(args){
		if(_.isEmpty(logData)){
			return false;
		}

		logData.ellapsed_time = helpers.getHours(+ new Date(),  logData.startTime);
		logData.startTime = new Date(logData.startTime);

		return logData;
	}

	function groupLogsByKey(data, key){
		let cats = helpers.pluckUniqueValues(data, key),
			retData = [],
			index = [];

		cats.forEach(function(cat){
			let tmp = {};
			tmp[key] = cat;
			tmp.ellapsed_time = 0;
			index.push(cat);
			retData.push(tmp);
		});
		data.forEach(function(row){
			retData[index.indexOf(row[key])].ellapsed_time += row.ellapsed_time;
		});

		return retData;
	}

	function groupLogsBy2Keys(data, key1, key2){
		let cats = helpers.pluckUniqueMultipleValues(data, key1, key2),
			retData = [],
			index = [];
			
		cats.forEach(function(arr){
			let temp = {};
			temp[key1] = arr[0];
			temp[key2] = arr[1];
			temp.ellapsed_time = 0;
			index.push(arr[0] + ( arr[1] || '') );
			retData.push(temp);
		});
		
		data.forEach(function(row){
			try{
				retData[ index.indexOf(row[key1] + row[key2]) ].ellapsed_time += row.ellapsed_time;
			}catch(e){
				//console.log(index, row[key1] + row[key2]);
			}
		});

		return retData;
	}

	/* now supports --groupby with --and so as to be able to group projects by tasks or vice versa */
	function analyze(args){
		let date = args.hasOwnProperty('date')? args.date : new Date();
		try {
			date = helpers.isoDate(date);
		}catch(e){
			console.error(e);
			process.exit(1);
		}

		compLog.push(logData);
		var newData = _.filter(compLog, (row) => {
          return helpers.isoDate(new Date(row.startTime)) == date; 
        });
		if(_.isEmpty(newData)){
			return [];
		}
		newData.forEach((row) => {
			/* so that we don't get NaN for unstopped timers */
			
			if(row.stopTime == undefined){
				row.stopTime = + new Date();
				row.status = "Still Running";
			}
			if( !row.hasOwnProperty('project') ){
				row.project = '';
			}
			if( !row.hasOwnProperty('task') ){
				row.task = '';
			}
			row.ellapsed_time = helpers.getHours(row.stopTime, row.startTime);
			row.startTime = helpers.fullDateString(new Date(row.startTime));
			row.stopTime = helpers.fullDateString(new Date(row.stopTime));
		});


		if(args.hasOwnProperty('groupby')){
			let groupby = (typeof args.groupby == 'string')? args.groupby.toLowerCase() : args.groupby,
				and = false;
			if(args.hasOwnProperty('and')){
				and = (typeof args.and == 'string')? args.and.toLowerCase() : args.and;
			}

			if(groupby == 'project' || groupby == 'projects'){

				if(and === false){
					newData = groupLogsByKey(newData, 'project');
				}else if (and == 'tasks' || and == 'task'){
					newData = groupLogsBy2Keys(newData, 'project', 'task');
				}

			}else if(groupby == 'task' || groupby == 'tasks'){
				
				if(and === false){
					newData = groupLogsByKey(newData, 'task');	
				}else if (and == 'project' || and == 'projects'){
					newData = groupLogsBy2Keys(newData, 'task', 'project');
				}

			}else{
				console.error("Invalid Goup By");
			}
				
		}
		return newData;
	}

	return Object.freeze({start, stop, checkStatus, analyze});
}

module.exports = Timer();
