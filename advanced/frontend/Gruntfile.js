module.exports = function(grunt) {
  
  grunt.config('angular_src','../../../angular.js/build/');
  grunt.config('angular_dst','web/js/angular/');
  grunt.config('angular_files',['angular.js','angular.min.js','angular.min.js.map']);
  
  grunt.config('bst_src','../../../bootstrap/dist/');
  grunt.config('bst_dst','web/');  
  

  grunt.loadNpmTasks('grunt-contrib-copy');
  
  // A very basic default task.
  grunt.registerTask('copyAngular', 'Copy Angular assets.', function() {    
    var names = grunt.config('angular_files');
    for( var i in names ){
      var name = names[i];
      var full_name_src = grunt.config('angular_src') + '/' +name;
      var full_name_dst = grunt.config('angular_dst') + '/' +name;
      grunt.file.copy(full_name_src,full_name_dst);
      grunt.log.write('Copy ' + name + ' file...').ok();
    }    
  });
  
  grunt.registerTask('copyBootstrap', 'Copy Bootstrap assets.', function() {    
    var source = grunt.config('bst_src');
    var dest   = grunt.config('bst_dst');
    grunt.file.recurse(source + '/js/',function(abspath,rootdir,subdir,filename){
      if( filename.indexOf('bootstrap') > -1){
        grunt.log.write('Copy bootstrap js ' + abspath).ok();
        grunt.file.copy(abspath,dest + '/js/bootstrap/' + filename);
      }      
    });
    grunt.file.recurse(source + '/css/',function(abspath,rootdir,subdir,filename){
      if( filename.indexOf('bootstrap') > -1){
        grunt.log.write('Copy bootstrap js ' + abspath).ok();
        grunt.file.copy(abspath,dest + '/css/bootstrap/' + filename);
      }      
    });    
  });
  
  
  grunt.registerTask('build', ['copyAngular','copyBootstrap']);
  
  grunt.registerTask('default', ['build']);

};

