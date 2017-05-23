var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.argument('path');
  }

  prompting() {

    return this.prompt([{
      type    : 'input',
      name    : 'projectName',
      message : 'Your project name',
      default : 'ms-phalcon-api'
    },{
      type    : 'input',
      name    : 'domainName',
      message : 'Your domain docker name',
      default : 'ms-phalcon-api.dev'
    },{
      type    : 'input',
      name    : 'dockerName',
      message : 'Your docker name',
      default : 'ms_phalcon'
    },{
      type    : 'input',
      name    : 'postfixPort',
      message : 'Your postfix port',
      default : '88'
    },{
      type    : 'input',
      name    : 'dbName',
      message : 'Your database name',
      default : 'database'
    },{
      type    : 'input',
      name    : 'baseUrl',
      message : 'Your base url',
      default : 'http://ms-phalcon-api.dev'
    }]).then((answers) => {
      this['dockerName']  = answers.dockerName;
      this['postfixPort'] = answers.postfixPort;
      this['dbName']      = answers.dbName;
      this['baseUrl']     = answers.baseUrl;
      this['projectName'] = answers.projectName;
      this['domainName']  = answers.domainName;
    });
  }

  getCode() {
    console.log('-- pull template from git --');
    var nodegit = require("nodegit");
    var Clone = nodegit.Clone;

    Clone.clone("https://github.com/akkapong/ms-phalcon-api-template-yeoman.git", this.options['path']+"/"+this.projectName, null)
      .then(function(repo) {
            return repo.getMasterCommit();
        },
        function(err){
            console.log(err);
        }
    );
  }

  writing() {
    
    console.log('-- Create Develop Config file --');
    this.fs.copyTpl(
      this.templatePath('develop.config.php'),
      this.destinationPath(this.options.path+'/'+this.projectName+'/app/config/develop.config.php'),
      { 
        dbName: this.dbName,
        baseUrl: this.baseUrl
     }
    );
    console.log('-- Create Docker Config file --');
    this.fs.copyTpl(
      this.templatePath('docker.config.php'),
      this.destinationPath(this.options.path+'/'+this.projectName+'/app/config/docker.config.php'),
      { 
        dockerName: this.dockerName,
        dbName: this.dbName,
        baseUrl: this.baseUrl
     }
    );
    console.log('-- Create Staging Config file --');
    this.fs.copyTpl(
      this.templatePath('staging.config.php'),
      this.destinationPath(this.options.path+'/'+this.projectName+'/app/config/staging.config.php'),
      { 
        dbName: this.dbName,
        baseUrl: this.baseUrl
     }
    );
    console.log('-- Create Production Config file --');
    this.fs.copyTpl(
      this.templatePath('production.config.php'),
      this.destinationPath(this.options.path+'/'+this.projectName+'/app/config/production.config.php'),
      { 
        dbName: this.dbName,
        baseUrl: this.baseUrl
     }
    );
    console.log('-- Create Vhost --');
    this.fs.copyTpl(
      this.templatePath('vhost.conf'),
      this.destinationPath(this.options.path+'/'+this.projectName+'/docker/web/sites-enabled/vhost.conf'),
      { 
        domainName: this.domainName
     }
    );
    console.log('-- Create Docker Compose --');
    this.fs.copyTpl(
      this.templatePath('docker-compose.yaml'),
      this.destinationPath(this.options.path+'/'+this.projectName+'/docker/docker-compose.yaml'),
      { 
        dockerName: this.dockerName,
        postfixPort: this.postfixPort,
     }
    );
    console.log('-- Create Mongo start script --');
    this.fs.copyTpl(
      this.templatePath('mongo_start_script.sh'),
      this.destinationPath(this.options.path+'/'+this.projectName+'/docker/mongo/start_script.sh'),
      { 
        dbName: this.dbName
     }
    );
    console.log('-- Create Main start script --');
    this.fs.copyTpl(
      this.templatePath('main_start_script.sh'),
      this.destinationPath(this.options.path+'/'+this.projectName+'/docker/start_server.sh'),
      { 
        dockerName: this.dockerName
     }
    );
  }

  end() {
    console.log("<<<<< FINSIH >>>>");
  }
};