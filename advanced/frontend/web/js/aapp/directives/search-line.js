/* global ObjectHelper */

atcCS.directive('searchLine', [
  'User','$wndMng','$articulWnd', '$searchDropdown','$location','storage',
  function ($user, $wndMng, $articulWnd, $searchDropdown,$location, $storage){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    templateUrl: '/search-line.html',
    transclude: true,
    scope: true,
    controller: function controller($scope, $element, $attrs, $transclude){
      var icons = $($element).find("div.search-icons");
      var cars  = icons.find('button#search-cars');    
      var subs  = icons.find('button#search-sub');    
      var cnfg  = icons.find('button#search-cfg');    
      var search= icons.find('button#search-request');    
      var input = $($element).find("input");
      
      $scope.history  = $storage.get('history') || new Array(0);
      $scope.helper   = [];
      $scope.keyTimer = false;
      $scope.isAdmin  = $user.isAdmin;

      $scope.filter = ''; 
      $scope.typeFilter = false;
      $scope.typeInfo = false;
      //Создание структур данных      
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
        if( target.hasClass('info-btn') ){
          $articulWnd.requestInfo(data['aid'],$scope.treeWnd,data['number']);
          return;
        }
        
        console.log(event);
      };
      //Создание дополнительных отображений
      $searchDropdown.setParent($element);
      
      $scope.carsWnd = $wndMng.createWindow({
        title: "Подобрать по автомобилю",
        vPos: cars.offset().top + cars.position().top + cars.height(),
        hPos: cars.offset().left + cars.position().left - cars.width(),
        hSize: '25%',
        vSize: '40%',
        hAlign: 'right',
        vAlign: 'top',
        hideIfClose: true,
        show: false
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
      
      $scope.cfgWnd = $wndMng.createWindow({
        title: "Настройки",
        vPos: cnfg.offset().top + cnfg.position().top + cnfg.height(),
        hPos: cnfg.offset().left + cnfg.position().left - cnfg.width()*5,
        hSize: '10%',
        vSize: '30%',
        hAlign: 'right',
        vAlign: 'top',
        hideIfClose: true,
        show: true
      });

      //Установка темплейтов
      $wndMng.setBodyByTemplate($scope.carsWnd, '/parts/_car-select-part.html',   $scope);
      $wndMng.setBodyByTemplate($scope.treeWnd, '/parts/_car-select-group.html',  $scope);      
      $wndMng.setBodyByTemplate($scope.cfgWnd,  '/parts/_settings.html',          $scope);
      $searchDropdown.setTemplate('/parts/_search-dropdown-part.html',            $scope);
      //Установка слушателей
      cars.click( toggle($scope.carsWnd) ); 
      subs.click( $searchDropdown.toggle );
      cnfg.click( toggle($scope.cfgWnd) ); 
      search.click( onSearchClick );
      input.keydown(onKeyDown);      
      
      $scope.onArticulSelect = function (number){
        input.val( number );
        input.trigger('change'); 
        $searchDropdown.hide();
      };
      
      $scope.onDropDownInfo = function (aid,number){
        $articulWnd.requestInfo(aid,$scope.treeWnd,number);
      };
      
      $scope.onStartSearch = function(){
        console.log("StartSearch");
        var searchText  = input.val();
        var clearText   = String(searchText).replace(/\W*/gi,"");
        
        ObjectHelper.addUniq($scope.history, clearText);
        $scope.history.splice(20);        
        $storage.set('history',$scope.history);        
        
        $searchDropdown.hide();
        $scope.$apply(function() {
          $location.path('brands/'+clearText);
        });        
      };
      
      $scope.loadPrices = function(){        
        $wndMng.show($scope.priceWnd);        
      };
      
      function onSearchClick(event){
        $searchDropdown.hide();
        $scope.onStartSearch();
        return;
      }
      
      function onKeyDown(event){        
        if( $scope.keyTimer ){
          clearTimeout($scope.keyTimer);
        }
        
        if( event.keyCode === 13 ){
          $scope.onStartSearch();
          return;
        }
        $scope.keyTimer = setTimeout(typingTimerOn,700);
      };
      
      function typingTimerOn(event){        
        $user.getTypingHelper( input.val(), function (data){
          if( (data instanceof Array) && data.length ){
            $scope.helper = data;
            $searchDropdown.show();
          }          
        });
      };  
      
      function toggle(window){
        return function(){
          $wndMng.toggle(window);
        };
      }
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