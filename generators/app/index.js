'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the wicked ' + chalk.red('Edison') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'project-name',
        message: 'What do you want to call your new Edison project? (no spaces please)'
      },
      {
        type: 'list',
        name: 'library',
        message: 'Which robotics library would you like to use?',
        choices: [
          { key: "c",name: "Cylon",value: "cylon" },
          { key: "j",name: "Johnny Five",value: "johnnyfive" }
        ]
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      
      //TODO: here we need to parse the _package.json, _config.js, etc. files, inject our prompt values, and then generate the real files
      //not sure if these all need to be explicitly included in order for them to be generated, but apparently so
      this.fs.copy(this.templatePath('_package.json'),this.destinationPath('package.json'));
      this.fs.copy(this.templatePath('_config.js'),this.destinationPath('config.js'));
      this.fs.copy(this.templatePath('_app.js'),this.destinationPath('app.js'));
    },

    projectfiles: function () {
      this.fs.copy(this.templatePath('_gulpconfig.js'),this.destinationPath('gulpconfig.js'));
      this.fs.copy(this.templatePath('_gulpfile.js'),this.destinationPath('gulpfile.js'));
    }
  },

  install: function () {
    this.installDependencies();
  }
});
