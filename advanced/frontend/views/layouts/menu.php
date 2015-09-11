<?php
use yii\helpers\Url;

?>

<div class="head" style="text-align: center">
  <div class="head-logo">
    <a href="<?= Url::home();?>">
      <img class="hidden-md-down" src="img/logo_left.png"/>
      <img class="hidden-lg-up" src="img/logo_left_min.png"/>
    </a>
  </div>

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
<div class="info">
    <p class="hidden-md-down"><img src="img/callus.png"/>+7 (8412) 763-533<img src="img/callus.png"/>+7 (8412) 518-302</p>
    <p class="hidden-lg-up"><img src="img/callus.png"/>+7 (8412) 763-533</p>
    <p class="hidden-lg-up"><img src="img/callus.png"/>+7 (8412) 518-302</p>
    <p class="hidden-sm-down"><img src="img/mail.png"/><a href="mailto:sales@atc58.ru">sales@atc58.ru</a></p>
    <p class="hidden-md-down"><img src="img/skype.png"/><a href="skype:atc_58">АвтоТехСнаб(atc_58)</a></p>
</div>
<div class="search-bar" ng-controller="searchControl">
  <div class="dropdown">
    <button class="btn btn-info" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown trigger
    <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" aria-labelledby="dLabel">
    ...
  </ul>
  </div>
  <p>Selected: {{1+2}} {{address.selected.formatted_address}}</p>
  <ui-select ng-model="address.selected">
    <ui-select-match placeholder="Введите артикул детали...">{{$select.selected.formatted_address}}</ui-select-match>
    <ui-select-choices repeat="address in addresses track by $index"
             refresh="refreshAddresses($select.search)"
             reset-search-input="false"
             refresh-delay="0">
      <div ng-bind-html="address.formatted_address  | highlight: $select.search"></div>
    </ui-select-choices>
  </ui-select>
</div>  

<?php
  /* @var $this yii\web\View */
  $this->registerJs("$('.circle').tooltip({});");
  $this->registerJs("$('[data-toggle=\"dropdown\"').dropdown({});");
  $this->registerJsFile("js/search/controll.js",['depends'=>[frontend\assets\AngularAsset::class]]);
?>