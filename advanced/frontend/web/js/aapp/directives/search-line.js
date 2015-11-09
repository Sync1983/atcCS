atcCS.directive('searchLine', function (){
  return {
    //require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/search-line.html',
    scope: {
      
    },
    controller: function controller($scope, $element, $attrs, $transclude){
      console.log($scope);
      $scope.tags = {
        'sup'   : {
          'NISSAN': [1,2,3,4]
        },
        'brand' : {
          'GNK'   : [1],
        },
        'model' : {
          'AD'    : [2],
        },
        'part'  : {
          "256G3" : "256G3"
        }
      };
      
      var tagIcons = $($element).find('div.tag-icons');
      var input    = $($element).find('input');
      for(var tag in $scope.tags){
        var style = tag;
        var items = $scope.tags[tag];
        
        for(var item in items){
          var icon = $('<span></span>');
          var close_icon = $('<span></span>');
          close_icon.addClass("glyphicon glyphicon-remove");
          icon.text(item);
          icon.addClass("icon-" + style);
          icon.append(close_icon);
          icon.attr('type',tag);
          icon.attr('key',item);
          tagIcons.append(icon);
        }
      }

      var width = $(tagIcons).width();
      input.css({
        'padding-left' : width + 20
      });

    },
    compile: function compile(templateElement, templateAttrs){
      
    },
    link: function link(scope, element, attrs, modelCtrl){
      
      //$(element).children('.head').text(scope.title);
    }
  };
} );