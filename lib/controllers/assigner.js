#!/usr/bin/env node
'use strict';

var model = require('../models/model.js');


// timelog assign <task name> to <project name|uid>
function Assigner(args){

    if(!args.hasPos(1) || ( !args.hasPos(3) && !args.hasArg('uid') ) || (args.hasPos(2) && args.getPos(2) !== "to")){
        console.error('Timelog takes both a task name and a project name or uid with the following syntax:');
        console.log('timelog assign <task name> to <project name|uid>');
        process.exit(1);
    }

    var proj, uid = false;
    if(args.hasArg('uid')){
    	uid  = true;
    	proj = args.getArg('uid');
    }else{
    	proj = args.getPos(3);
    }

    model.setProjectTask(proj, args.getPos(1), uid);

}

exports._ = function(args){
	Assigner(args);
};
