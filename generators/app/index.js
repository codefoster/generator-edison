/// <reference path="../../typings/node/node.d.ts"/>
'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
  constructor: function(){
    yeoman.generators.Base.apply(this, arguments);
    this.argument('appname', { type: String, required: false });
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Edison') + ' project generator!'
    ));

    
    var rootQuestions = [
      //if the user didn't provide a name from the CLI, then prompt them for it
      {
        type: 'input',
        name: 'projectname',
        message: 'What do you want to call your new Edison project? (no spaces please)',
        when: !this.appname
      },
      {
        type: 'list',
        name: 'library',
        message: 'Which robotics library would you like to use?',
        choices: [
          { key: "c", name: "Cylon", value: "cylon" },
          { key: "j", name: "Johnny Five", value: "johnnyfive" }
        ],
        store:true
      },
      {
        type: 'confirm',
        name: 'useGulpAndCandyman',
        message: 'Do you want to use Gulp and Candyman for deploying your code to your device?',
        default: true
      }
    ];
    
    var gulpQuestions = [
      {
        type: 'input',
        name: 'deviceName',
        message: 'What did you name your Edison device?',
        default: 'edison'
      }
    ];

    this.prompt(rootQuestions, function (rootAnswers) {
      var that = this;
      this.rootAnswers = rootAnswers;
      if(rootAnswers.useGulpAndCandyman) {
        that.prompt(gulpQuestions,function(gulpAnswers){
          that.gulpAnswers = gulpAnswers;
          done();
        });
      }
      else { done(); }
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(this.templatePath('_package.json'),this.destinationPath('package.json'));
      this.fs.copy(this.templatePath('_config.js'),this.destinationPath('config.js'));
      
      
      var libraryTemplate = (this.rootAnswers.library == 'johnnyfive' ? '_app_johnnyfive.js' : '_app_cylon.js');
      this.fs.copy(this.templatePath(libraryTemplate),this.destinationPath('app.js'));

    },

    projectfiles: function () {
      if(this.rootAnswers.useGulpAndCandyman) {
        this.fs.copy(this.templatePath('_gulpfile.js'),this.destinationPath('gulpfile.js'));

        var gulpConfigValue = {
          targetDevices: [
              { devicename: this.rootAnswers.deviceName, hostname: this.rootAnswers.deviceName + '.local' }
          ],
          projectName: this.rootAnswers.projectname,
          user: 'username', //this.rootAnswers.deviceUsername,
          password: 'password', //this.rootAnswers.devicePassword,
          startFile: 'app.js'
        };
        //TODO: write gulpConfigValue out to file (gulpconfig.js)
        fs.writeFile(this.destinationPath('gulpconfig.js'), JSON.stringify(gulpConfigValue));
        //this.fs.copy(this.templatePath('_gulpconfig.js'),this.destinationPath('gulpconfig.js'));
      }
    }
  },

  install: function () {
      if(this.rootAnswers.useGulpAndCandyman) {
        this.npmInstall(['gulp','candyman'],{'saveDev':true});
      }
      switch(this.rootAnswers.library){
        case 'johnnyfive': this.npmInstall(['johnny-five','edison-io']); break;
        case 'cylon': this.npmInstall(['cylon','cylon-intel-iot','cylon-gpio','cylon-i2c']); break;
      }
  }
});
