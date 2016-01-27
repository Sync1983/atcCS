atcCS.directive('searchLine', ['User','tagsControl','$wndMng','$sce', function ($user, $tagsControl, $wndMng, $sce){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    templateUrl: '/search-line.html',
    transclude: true,
    scope: {
      query: "=",
    },
    controller: function controller($scope, $element, $attrs, $transclude){      
      var icons = $($element).find("div.search-icons");
      var cars  = icons.find('button#search-cars');    
      var input = $($element).find("input");

      $scope.filter = "tig"; 
      $scope.typeFilter = "";      
      $scope.typeInfo = false;
      
      $scope.treeModel = {
          text: "Категории",
          type: 'request',
          url: $user.getUrl('helper','get-groups'),
          data: {path:"",type:""}
        };
        
      $scope.typeSelector = {
          text: "Список автомобилей",
          type: 'request',
          url: $user.getUrl('helper','get-mmt'),          
          data: {path:""}
        };        
      
      $scope.typeSelected = function(data){
        function response(answer){          
          $scope.typeInfo = answer;
          $scope.typeFilter = data;
          $wndMng.show($scope.treeWnd);
        };
        
        $user.findTypeDescr(data,response);        
      };
      
      $scope.groupSelected = function(data,item,lscope,event){
        var target = $(event.target);
        
        if( target.hasClass('search-btn') ){
          input.val( data['number'] );
          input.trigger('change');          
          return;
        }
        console.log(event);
      };

      function toggle(window){
        return function(){
          $wndMng.toggle(window);
        };
      }
      
      $scope.carsWnd = $wndMng.createWindow({
        title: "Подобрать по автомобилю",
        vPos: cars.offset().top + cars.position().top + cars.height(),
        hPos: cars.offset().left + cars.position().left - cars.width(),
        hSize: '25%',
        vSize: '40%',
        hAlign: 'right',
        vAlign: 'top',
        hideIfClose: true,
        //show: false
      });

      $scope.treeWnd = $wndMng.createWindow({
        title: "Выбрать по каталогу",
        vPos: $scope.carsWnd.vPos,
        hPos: $scope.carsWnd.hPos - $scope.carsWnd.hSize,
        hSize: '25%',
        vSize: '40%',
        hAlign: 'right',
        vAlign: 'top',
        hideIfClose: true,
        show: false
      });
      
      $wndMng.setBodyByTemplate($scope.carsWnd, '/parts/_car-select-part.html', $scope);
      $wndMng.setBodyByTemplate($scope.treeWnd, '/parts/_car-select-group.html', $scope);
      
      cars.click( toggle($scope.carsWnd) );

    },    
    link: function link(scope, element, attrs, modelCtrl){      
      scope.$watch(
        function() { return modelCtrl.$viewValue; },
        function(newVal){
          scope.text = newVal;          
          return newVal;
      });

      scope.$watch("text",
        function(newVal){          
          modelCtrl.$setViewValue(newVal);
          return newVal;
      },true);
    }
  };
}] );