atcCS.directive('inputhelper', ['$compile','$parse','$http','$filter', function ($compile,$parse,$http,$filter){
  return {
    require: "ngModel",
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/input-help.html',
    scope: {
      ngModel       : "=",
      placeholder   : "@",
      url           : "@",
      startLength   : "@",
      subFilter     : "@",
      inputClass    : "@",
      onLoad        : "="
    },
    controller: function controller($scope, $element, $attrs, $transclude,$filter){

      $scope.change = function inputChange(){
        var value = $scope.data.inputValue;
        var url   = $scope.url;
        var req = {
          method: 'GET',
          url: url,
          responseType: 'json',
          params: { params: value }
        };

        if( value.length < $scope.startLength*1){
          return;
        }

        $http(req).then(
          function success(response){
            var list = response && response.data || {};


            if( list && list.count ){
              $scope.count = list.count;
              delete list.count;
            }

            $scope.data.filters = null;

            if( (!list) || (Object.keys(list).length <= 1) || (list.length === 0) ){
              $scope.visible = false;
            } else {
              $scope.visible = true;
            }

            $scope.list = list;
            $scope.fullList = list;
            if( $scope.onLoad instanceof Function ){
              $scope.onLoad();
            }
          },function error(response){
            $scope.list = {};
            $scope.fullList = {};
            $scope.count = 0;
        });

      };

      $scope.subfilter = function subfilter(){
        $scope.list = $filter($scope.subFilter)($scope.fullList,$scope.data.filters);
      };

      $scope.toggle = function onToggle(){
        if( !$scope.visible && ($scope.count === 0)){
          return;
        }
        $scope.visible = !$scope.visible;
      };

    },

    link: function link($scope, $element, $attrs, modelCtrl){
      $scope.data = {
        inputValue  : "",
        filters     : ""
      };
      $scope.list = {"0":{"id":"1969592","article":"123444","supply":"SCHLIECKMANN\n","descrRU":"Решетка вентилятора","descrEN":"Решетка вентилятора"},"1":{"id":"4520540","article":"12344","supply":"FARE\n","descrRU":"Шланг радиатора\n","descrEN":"Шланг радиатора\n"},"2":{"id":"170764","article":"123440601","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"3":{"id":"1969591","article":"123443","supply":"SCHLIECKMANN\n","descrRU":"Решетка вентилятора","descrEN":"Решетка вентилятора"},"4":{"id":"1302189","article":"123440","supply":"ERNST\n","descrRU":"Труба выхлопного газа\n","descrEN":"Труба выхлопного газа\n"},"5":{"id":"539189","article":"1234431396","supply":"BOSCH\n","descrRU":"Электропроводка; Электропроводка\n","descrEN":"Электропроводка; Электропроводка\n"},"6":{"id":"1443113","article":"123449","supply":"SACHS\n","descrRU":"Амортизатор\n","descrEN":"Амортизатор\n"},"7":{"id":"2407016","article":"12344100002","supply":"MEYLE\n","descrRU":"Подвеска","descrEN":"Подвеска"},"8":{"id":"1969593","article":"123445","supply":"SCHLIECKMANN\n","descrRU":"Решетка вентилятора","descrEN":"Решетка вентилятора"},"9":{"id":"170766","article":"123443801","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"10":{"id":"539188","article":"1234431293","supply":"BOSCH\n","descrRU":"Регулятор генератора\n","descrEN":"Регулятор генератора\n"},"11":{"id":"170767","article":"123443901","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"12":{"id":"539191","article":"1234477022","supply":"BOSCH\n","descrRU":"Соединитель проводов\n","descrEN":"Соединитель проводов\n"},"13":{"id":"539190","article":"1234477018","supply":"BOSCH\n","descrRU":"Соединитель проводов\n","descrEN":"Соединитель проводов\n"},"14":{"id":"1099497","article":"12344911","supply":"EBERSPÄCHER\n","descrRU":"Соединительные элементы","descrEN":"Соединительные элементы"},"15":{"id":"24695","article":"12344901","supply":"EBERSPÄCHER\n","descrRU":"Прокладка","descrEN":"Прокладка"},"16":{"id":"3691103","article":"12344R","supply":"SERCORE\n","descrRU":"Приводной вал\n","descrEN":"Приводной вал\n"},"17":{"id":"2407018","article":"12344710003","supply":"MEYLE\n","descrRU":"Гидравлический насос","descrEN":"Гидравлический насос"},"18":{"id":"539187","article":"1234431256","supply":"BOSCH\n","descrRU":"Конденсатор","descrEN":"Конденсатор"},"19":{"id":"2407017","article":"12344710001","supply":"MEYLE\n","descrRU":"Гидравлический насос","descrEN":"Гидравлический насос"},"20":{"id":"539192","article":"1234485025","supply":"BOSCH\n","descrRU":"Штекерная гильза","descrEN":"Штекерная гильза"},"21":{"id":"170765","article":"123443701","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"22":{"id":"1374164","article":"1234477014","supply":"BOSCH\n","descrRU":"Соединитель проводов\n","descrEN":"Соединитель проводов\n"},"23":{"id":"1443112","article":"123441","supply":"SACHS\n","descrRU":"Амортизатор\n","descrEN":"Амортизатор\n"}};
      $scope.fullList = {};
      $scope.count = 10;
      $scope.visible = false;

    }

  };
}]);
