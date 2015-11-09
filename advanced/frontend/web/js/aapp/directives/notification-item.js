atcCS.directive('notificationItems', ['Notification', function ($notify){
  return {    
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    template: "<ul></ul>",     
    transclude: false,
    scope: false,
    controller: function controller($scope, $element, $attrs, $transclude){      

      $scope.itemShow = function(){
        var index = $(this).attr('index');
        var item = $notify.list[index];

        item.new = 0;
        $(this).children('button').children('span').remove();
      };
      
    },    
    link: function link(scope, element, attrs, modelCtrl){
      
      for(var i = 0; i< $notify.list.length; i++){
        var item = $notify.list[i];
        var row = $("<li></li>");
        var button = $('<button></button>');

        item.text.replace(/\"/,'');

        row.addClass('notification-item');
        row.addClass(item.class);
        row.attr('index',i);
        $(row).append(button);

        button.attr('type','button');
        button.attr('data-toggle','popover');
        button.attr('title','Просмотреть');
        button.attr('data-content',item.text);
        button.addClass('btn');
        button.addClass(item.style);
        button.text(item.head);

        if( item.new ){
          button.prepend( '<span class="glyphicon glyphicon-flag pull-left text-muted"></span>');
        }

        $(element).prepend(row);
        $(row).on('show.bs.popover',scope.itemShow);
      }
    }
  };
}] );


