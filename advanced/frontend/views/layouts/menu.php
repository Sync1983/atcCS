<?php
use yii\helpers\Url;

?>

<div class="head" style="text-align: center" ng-controller="headControl">
  <div class="head-logo">
    <a href="<?= Url::home();?>">
      <img class="hidden-md-down" src="img/logo_left.png"/>
      <img class="hidden-lg-up" src="img/logo_left_min.png"/>
    </a>
  </div>
  <div ng-switch="user.isLogin">
    <div ng-switch-when="true">
      <div class="circle pull-right clearfix" data-toggle="tooltip" data-placement="bottom" title="Настройки">
        <img src="img/setup_icon.png"/>
      </div>
      <div class="circle pull-right clearfix" data-toggle="tooltip" data-placement="bottom" title="Заказы">
        <img src="img/order_icon.png"/>
      </div>
      <div class="circle pull-right clearfix" data-toggle="tooltip" data-placement="bottom" title="Корзина">
        <img src="img/basket_icon.png"/>
      </div>
    </div>
    <div ng-switch-when="false">
      <div class="circle pull-right clearfix" data-toggle="tooltip" data-placement="bottom" title="Войти в учетную запись" ng-click="showLogin();">
        <img src="img/login_icon.png"/>
      </div>
      <?php $this->beginContent('@app/views/layouts/login-window.php');
            $this->endContent(); ?>
    </div>
  </div>
</div>
<div class="info">
    <p class="hidden-md-down"><img src="img/callus.png"/>+7 (8412) 763-533<img src="img/callus.png"/>+7 (8412) 518-302</p>
    <p class="hidden-lg-up"><img src="img/callus.png"/>+7 (8412) 763-533</p>
    <p class="hidden-lg-up"><img src="img/callus.png"/>+7 (8412) 518-302</p>
    <p class="hidden-sm-down"><img src="img/mail.png"/><a href="mailto:sales@atc58.ru">sales@atc58.ru</a></p>
    <p class="hidden-md-down"><img src="img/skype.png"/><a href="skype:atc_58">АвтоТехСнаб(atc_58)</a></p>
</div>
<div class="search-bar row-md-top btn-group-justified" ng-controller="searchControl">
<!-- Список каталогов для перехода -->
  <div class="dropdown col-md-first">
    <button class="btn btn-info disabled" id="catalog-btn" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Каталоги    
    </button>
    <ul class="dropdown-menu" aria-labelledby="catalog-btn">
      ...
    </ul>
  </div>
<!-- Строка поиска и список выбора -->
  <div class="dropdown" id='searchFilter' style="width:70%">
    <input  ng-change='change()'
            ng-model='query'
            ng-value='selected'
            ng-app=""placeholder='Введите артикул запчасти... '
            type='text'
            xng-focus='cleared'
            class='form-control'
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">    
    <ul ng-show='query' class='dropdown-menu' aria-labelledby="searchFilter">
      <li ng-click='select(item)' ng-repeat='item in items | filter: query'>
        {{item}}
      </li>
    </ul>
  </div>
<!-- Флаг отображения аналогов -->  
  <checkbox ng-model="user.analogShow" class="btn-info">&nbsp;Аналоги</checkbox>
  
<!-- Кнопка выбора процентов -->
<select2 class="btn btn-info col-md-last"
         ng-model     = "markup"
         placeholder  = "Наценка"         
         list         = "user.markup"
         show-pattern = "item.n + ' ' + item.v +'%'"
         >
  <div>
    <span>{{item.n}}</span><br>
    <small>
      Размер: {{item.v}}%
    </small>
  </div>
</select2>

</div>


<?php
  /* @var $this yii\web\View */
  $this->registerJs("$('.circle').tooltip({});");
  $this->registerJs("$('[data-toggle=\"dropdown\"').dropdown({});");