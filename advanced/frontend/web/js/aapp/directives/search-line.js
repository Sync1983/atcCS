atcCS.directive('searchLine', ['User','tagsControl','$wndMng','$sce', function ($user, $tagsControl, $wndMng, $sce){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    templateUrl: '/search-line.html',
    transclude: true,
    scope: {},
    controller: function controller($scope, $element, $attrs, $transclude){      
      var icons = $($element).find("div.search-icons");
      var cars  = icons.find('button#search-cars');

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
        };
        
        $user.findTypeDescr(data,response);        
      };

      function toggle(window){
        return function(){
          $wndMng.toggle(window);
        };
      }

      function selectAndConvert(text,data, type){
        var result = [];
        for(var i in data){

          var value = data[i];
          var regReplace = new RegExp(text,'im');

          result.push({
            id: i,
            type: type,
            text: value,
            trustedHtml:  $sce.trustAsHtml(
                            String(value).
                              replace( regReplace, '<b>' + text.toUpperCase() + '</b>')
                          )
          });
        }

        return result;
      }

      function mmodelAnswer(text){
        return function(answer){          
          var data = answer && answer.data;
          if( !data ){
            return ;
          }

          $scope.selector.models        = ( data && data.model ) ? selectAndConvert(text, data.model, 'model'): {};
          $scope.selector.mfcs          = ( data && data.mfc )   ? selectAndConvert(text, data.mfc, 'mfc'): {};
          $scope.selector.descriptions  = ( data && data.descr )   ? selectAndConvert(text, data.descr, 'descr'): {};
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
        //show: false
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

      scope.$watch(
        function(scope) { return scope.text; },
        function(newVal){
          modelCtrl.$setViewValue(newVal);
          return newVal;
      });
    }
  };
}] );