atcCS.directive('searchLine', ['User','tagsControl','$wndMng','$sce', function ($user, $tagsControl, $wndMng, $sce){
  return {    
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/search-line.html',
    scope: {},
    controller: function controller($scope, $element, $attrs, $transclude){
      var icons = $($element).find("div.search-icons");
      var cars  = icons.find('button#search-cars');

      $scope.selector = {
        mmodel: "nissan",
        models: {},
        mfcs:  {},
        descriptions: {},
        descr: "поршн",
        showDescr: false,
        selMFCs: [],
        selModels: [],
        selDescr: []
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

      $scope.onMMFind = function(){
        var text = $scope.selector.mmodel;
        
        if( text.length < 2 ){
          return ;
        }

        $user.findMModel($scope.selector.mmodel, $scope.tagsCtrl).then(mmodelAnswer(text));
      };

      $scope.onSelectMModel = function(mmodel){
        $scope.tagsCtrl.pushTag(mmodel);
        $scope.selector.mmodel    = "";
        $scope.selector.selMFCs   = $scope.tagsCtrl.getTags('type','mfc');
        $scope.selector.selModels = $scope.tagsCtrl.getTags('type','model');
        $scope.selector.selDescr  = $scope.tagsCtrl.getTags('type','descr');
        
        if( mmodel.type === "mfc"){          
          return;
        } else if ( mmodel.type === 'model' ){
          //Если производители модели не выбраны - нужно запросить и добавить их в теги          
          if( $scope.selector.selMFCs.length === 0 ){
            $user.findMFCs($scope.tagsCtrl).then(mmodelAnswer(' '));
            return;
          } else if( ($scope.selector.selMFCs.length !== 0) &&
                     ($scope.selector.selModels.length !== 0) ){

            $scope.selector.models = [];
            $scope.selector.mfcs = [];
            $scope.selector.showDescr = true;            
          } else {
            $scope.selector.showDescr = false;
          }
        } else if( mmodel.type === 'descr' ){
          $user.findParts($scope.tagsCtrl).then(function(answer){
            var data = answer && answer.data;
            if( !data ){
              return;
            }

            var window = $wndMng.createWindow({
              title:  "Список подходящих деталей",
              hPos:   $scope.carsWnd.hPos - $scope.carsWnd.hSize * 2 - 5,
              vPos:   $scope.carsWnd.vPos,              
              vSize:  $scope.carsWnd.vSize,
              hSize:  $scope.carsWnd.hSize,
            });            
            
            var newScope    = $scope.$new(true);
            newScope.items  = data.parts;
            newScope.mfc    = $scope.selector.selMFCs;
            newScope.model  = $scope.selector.selModels;
            newScope.descr  = $scope.selector.selDescr;
            newScope.wnd    = window;
            
            $wndMng.setBodyByTemplate(window, '/parts/_car-select-articul-part.html', newScope);
          });
        }
      };

      $scope.onDescrFind = function(){
        var text = $scope.selector.descr;
        if( text.length < 2 ){
          return;
        }
        $user.findDescr(text,$scope.tagsCtrl).then(mmodelAnswer(text));
      };
      
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
      
      $wndMng.setBodyByTemplate($scope.carsWnd, '/parts/_car-select-part.html', $scope);
      var tags  = $wndMng.getBody($scope.carsWnd).find("div#tags");      
      $scope.tagsCtrl = $tagsControl.init(tags);

      // Just for debug!!!
        $scope.tagsCtrl.pushTag({
            id: "558",
            text: "NISSAN",
            type: "mfc"
          });
        $scope.tagsCtrl.pushTag({
            id: "1475",
            text: "NISSAN ALMERA   Наклонная задняя часть (N15)",
            type: "model"
          });
        $scope.selector.showDescr = true;
      // ===>>> Just for debug!!!
      
      cars.click( toggle($scope.carsWnd) );

    },
    compile: function compile(templateElement, templateAttrs){
      
    },
    link: function link(scope, element, attrs, modelCtrl){

      //$(element).children('.head').text(scope.title);
    }
  };
}] );