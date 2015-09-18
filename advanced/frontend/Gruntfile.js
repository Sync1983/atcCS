module.exports = function(grunt) {

  grunt.initConfig({
    copyBootstrap: {
      src: '../../../bootstrap/dist/',
      dst: 'web/'
    },
    compileAngularView: {
      src: 'views/site/angular/',
      map: 'views/site/angular/views.map',
      dest:'views/layouts/main.php',
      lineStart : '<!-- Grunt views place start -->',
      lineEnd   : '<!-- Grunt views place stop -->'
    },
    watch:{
      options: {
        livereload: true
      },
      views:{
        files: ['views/site/angular/**/*.html'],
        tasks: ['compileAngularView'],
        options: {
          reload: true
        }
      }
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
  
  
  grunt.registerTask('view-compile', ['compileAngularView']);
  grunt.registerTask('build', ['copyBootstrap','compileAngularView']);
  grunt.registerTask('default', ['build']);

  grunt.loadNpmTasks('grunt-contrib-watch');

};

