var fs = require('fs');
var path = require('path');
var home = require('os').homedir();
exports.install = function(uninstall, install){
    var dirStruct = {
            '.timelog': {
                'appData' : [ 'projects.json','tasks.json', 't_p.json' ],
                'logs.json' : null,
                'logData' : ['logs.json']
            }
        },
        _methods = {
            'install' : function(){
                // put installation methods here
            },
            'uninstall' : function(){
                // put unsintall method here
            
            },
            'checkAndMake' : function(file){
                if(!fs.existsSync(file)){
                    if(file.search('.json') === -1 && file.search('.js') === -1){
                        fs.mkdirSync(file);
                    }else{
                        fs.closeSync(fs.openSync(file, 'w'));
                    }
                }
            },
            'check' : function(obj, directory){
                // check the integrity of the installation
                if(typeof directory == 'undefined'){
                    directory = home + path.sep;
                }
                if(directory.substr(directory.length - 1) !== path.sep){
                    directory += path.sep;
                }
                for(var key in obj){
                    this.checkAndMake(directory + key);
                    if(Array.isArray(obj[key])){
                        for(var i = 0; i < obj[key].length; i++){
                            this.checkAndMake(directory + key + path.sep + obj[key][i]);
                        }
                    }else if(typeof obj[key] === 'object'){
                       this.check(obj[key], directory + key );
                    }
                }
                return true;
            }
        };
    
    if(uninstall !== undefined && uninstall === true){
        _methods.uninstall();
        return true;
    }
    if(install !== undefined && install === true){
        _methods.install();
        return true;
    }
    if(typeof home === 'undefined'){
        console.error("Something went wrong. Could not retrieve home directory");
        return false;
    }

    var check = _methods.check(dirStruct);
    var counter = 0;
    while(!check && counter < 10){
        _methods.install();
        check = _methods.check();
        // to avoid the infinite loop
        counter++;
    }
    return check;
};
