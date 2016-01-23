atcCS.directive( 'tileSelector',['$http', function ($http){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    template: '',
    transclude: false,
    templateUrl: '/parts/_tile-selector.html',
    scope: {
      wsize: "@",
      textFilter: "@"
    },
    controller: function controller($scope, $element, $attrs, $transclude){
      $scope.tiles = {};      
      $scope.loaded = true;
      
      $scope.update = function(){
        var width = $($element).width();
        var workspaceWidth = Math.max(0,(width - width*0.05 - $scope.wsize*10));
        var maxTileWidth = Math.ceil(workspaceWidth / $scope.wsize);
        var maxTileHeight = maxTileWidth;
        
        var element = $($element);
        element.html('');
        
        for(var text in $scope.tiles){
          var data = $scope.tiles[text];
          var tile = $('<div></div>');
          
          tile.addClass('tile-selector tile');
          tile.text(text);
          tile.attr('data', data);
          tile.css('width',maxTileWidth);
          tile.css('height',maxTileHeight);          
          tile.css('line-height',maxTileHeight+"px");          
          
          element.append(tile);
        }
        
        console.log(width, maxTileWidth);
      };
     
     $scope.update();
    },
    link: function link(scope, element, attrs, modelCtrl){
      /*scope.$watch(
        function() { return modelCtrl.$viewValue; },
        function(newVal){
          scope.data = newVal;
          scope.update();
          return newVal;
      });*/
    }
  };
}] );




