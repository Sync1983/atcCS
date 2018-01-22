module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copyBootstrap: {
      src: '../../../bootstrap/dist/',
      dst: 'web/'
    },
    compileAngularView: {
      src: 'frontend/views/site/angular/',
      map: 'frontend/views/site/angular/views.map',
      dest:'frontend/views/layouts/main.php',
      lineStart : '<!-- Grunt views place start -->',
      lineEnd   : '<!-- Grunt views place stop -->'
    },
    compileAngularJS: {
      src: 'frontend/web/js/aapp/',
      dest:'frontend/web/js/_aapp.js'
    },
    sass:{
      dist: {
        options: {
          style: 'compressed'
        },
        files: { 'frontend/web/css/site.css': 'frontend/web/scss/site.scss',
                 'frontend/web/css/mobile.css': 'frontend/web/scss_mobile/mobile.scss'}
      }
    },
    watch:{
      options: {
        livereload: true,
        spawn: false
      },
      views:{
        files: ['frontend/views/site/angular/**/*.html','frontend/web/js/aapp/**/*.js','frontend/web/scss/**/*.scss'],
        tasks: ['compileAngularView', 'compileAngularJS','sass'],
        options: {
          reload: true,
          spawn: false
        }
      },
      mobile:{
        files: ['frontend/web/scss_mobile/**/*.scss', 'frontend/web/js/mapp/**/*.js', 'frontend/views/mobile/*.html'],
        tasks: ['sass', 'compileAngularJS','compileAngularView'],
        options: {
          reload: false,
          spawn: false
        }
      }
    }
  });
  
  grunt.event.on('watch', function(action, filepath, target) {    
    if( target !== "views" ){
      grunt.config('compileAngularJS.src', "frontend/web/js/mapp/");
      grunt.config('compileAngularJS.dest', "frontend/web/js/_mapp.js");
      
      grunt.config('compileAngularView.src', "frontend/views/mobile/");
      grunt.config('compileAngularView.map', "frontend/views/mobile/views.map");
      grunt.config('compileAngularView.dest', "frontend/views/layouts/mobile.php");
    }    
  });
  
  grunt.registerTask('copyBootstrap', 'Copy Bootstrap assets.', function() {    
    var config = grunt.config(this.name);
    var source = config.src;
    var dest   = config.dst;
    //Копируем скрипты
    grunt.file.recurse(source + '/js/',function(abspath,rootdir,subdir,filename){
      if( filename.indexOf('bootstrap') > -1){
        grunt.log.write('Copy bootstrap js ' + abspath).ok();
        grunt.file.copy(abspath,dest + '/js/bootstrap/' + filename);
      }      
    });
    //Копируем стили
    grunt.file.recurse(source + '/css/',function(abspath,rootdir,subdir,filename){
      if( filename.indexOf('bootstrap') > -1){
        grunt.log.write('Copy bootstrap js ' + abspath).ok();
        grunt.file.copy(abspath,dest + '/css/bootstrap/' + filename);
      }      
    });

  });

  grunt.registerTask('compileAngularView','Compile Angular Views to file',function(){
    var config  = grunt.config(this.name);
    var source  = config.src;
    var map     = config.map || source + '/views.map';
    var dest    = config.dest;
    var keyStart= config.lineStart;
    var keyStop = config.lineEnd;
    var fileMin = "<!-- Angular views -->";
    var fileMap = "List of included views";
    var htmlTagExp = new RegExp(">\n*\r*\t* *<","g");
    
    var list = grunt.file.expand({cwd: source + '/'},'**/*.html');
    list.forEach(function(name){
      var file = grunt.file.read(source + '/' + name);

      minimizeText = String(file).replace(htmlTagExp, "><");
      minimizeText = String(minimizeText).replace(new RegExp("[\n\t]*","g"), "");

      fileMap = fileMap + "\n" + name;
      fileMin = fileMin + "\n <!-- Collect from '" + source + "/" + name + "' file -->";
      fileMin = fileMin + "\n" +
                '<script type="text/ng-template" id="/' + name +'">' + "\n" +
                  minimizeText + "\n" +
                '</script>';
      grunt.log.write("Collect: " + name + " ").ok();
    });

    grunt.file.write(map,fileMap);
    grunt.log.write("Map file create ").ok();

    var destFile = grunt.file.read(dest);
    var regExp = new RegExp(keyStart + '[.\\s\\S]*' + keyStop);

    destFile = String(destFile).replace(regExp, keyStart + "\n" + fileMin + "\n" + keyStop);

    grunt.file.write(dest,destFile);    

    grunt.log.writeln("Replace tag in " + dest).ok();

  });

  grunt.registerTask("compileAngularJS",'CompileAnjular JS to file', function(){
    var config  = grunt.config(this.name);
    var source  = config.src;    
    var dest    = config.dest;

    var list = grunt.file.expand({cwd: source + '/'},'**/*.js');
    var fileText = "\"use strict\";";
    var minimizeText = "";
    
    list.forEach(function(name){
      var file = grunt.file.read(source + '/' + name);
      
      minimizeText = String(file);
     /* minimizeText = String(file).replace(new RegExp("[^:]\/\/.*$","igm"), "");
      minimizeText = String(minimizeText).replace(new RegExp("\/\*.*global.* \*\/",'ig'), "");
      minimizeText = String(minimizeText).replace(new RegExp("['\"]use.*strict['\"];*","g"), "");
      minimizeText = String(minimizeText).replace(new RegExp("[\n\t]*","g"), "");
      minimizeText = String(minimizeText).replace(new RegExp(" +","g"), " ");      */

      fileText = fileText + minimizeText + "\r\n";
      grunt.log.write("Collect: " + name + " ").ok();
    });
    
    grunt.file.write(dest,fileText);

    grunt.log.write("Anjular Min File Update ").ok();
  });
  
  
  grunt.registerTask('view-compile', ['compileAngularView']);
  grunt.registerTask('build', ['copyBootstrap','compileAngularView']);
  grunt.registerTask('default', ['build']);

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

};

