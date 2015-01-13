'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var generatorUtil = require('./generator-util');

module.exports = yeoman.generators.NamedBase.extend({
    constructor: function () {
        yeoman.generators.NamedBase.apply(this, arguments);
        var bowerConfig = require(path.join(process.cwd(), 'bower.json'));
        this.appName = bowerConfig.name;
        this.scriptAppName = generatorUtil.addAppNameSuffix(this.appName);
        this.classedName = this._.classify(this.name);
        this.cameledName = this._.camelize(this.name);
        this.appPath = bowerConfig.appPath;
    },
    generateSourceAndTest: function (templateName,dest) {
        this.sourceRoot(path.join(__dirname, './templates/javascripts'))
        this.template(
            this.templatePath(templateName + '.js'),
            this.destinationPath(path.join(this.appPath,dest,generatorUtil.addScriptSuffix(this.name)))
        );
        generatorUtil.addScriptToIndex(this.appPath,path.join(dest, this.name),this);
        //暂不添加test
    },
    generateHtmlFile: function (viewName,dest) {
        this.sourceRoot(path.join(__dirname, './templates/views'));
        dest = dest || path.join(this.appPath,'views',viewName,viewName + '.html');
        this.template(
            this.templatePath('view.html'),
            this.destinationPath(dest)//创建一层同名的目录，可以在这里创建其他视图，如dialog
        )
    }
});
