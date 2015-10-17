<?php
use yii\helpers\Url;

?>

<div class="head" style="text-align: center" ng-controller="headControl">  
  <div class="head-logo">
    <a href="<?= Url::home();?>">
      <img src="img/logo_left.png"/>      
    </a>
  </div>  
</div>

<div class="info">
    <p>
      <span><img src="img/callus.png"/>+7 (8412) 763-533</span>
      <span><img src="img/callus.png"/>+7 (8412) 518-302</span>
      <span><img src="img/mail.png"/><a href="mailto:sales@atc58.ru">sales@atc58.ru</a></span>
      <span><img src="img/skype.png"/><a href="skype:atc_58">АвтоТехСнаб(atc_58)</a></span>
    </p>
</div>
<div class="search-bar row-md-top btn-group-justified" ng-controller="searchControl">
  <div class="header-up">
    <div style=''>&nbsp;</div>
  </div>
<!-- Строка поиска и список выбора -->
  <inputhelper
                    input-class = "form-control"
                    ng-model    = "query"
                    placeholder = "Введите артикул запчасти... "
                    url         = "http://rest.atc58.bit/index.php?r=helper/articul"
                    param       = "search-string"
                    start-length= "3"
                    sub-filter  = "inputHelper"
                    on-load     = "searchListLodaded()"
                    >
    <div>
      <span class="header">Артикул: {{item.article}}</span>
      <small>Производитель: {{item.supply}} <span ng-show="item.descrRU" class="descr">Описание: {{item.descrRU}}</span></small>
      <ajax-button title="{{item.article}} - {{item.supply}}" data="{{item.article}}" url = "http://rest.atc58.bit/index.php?r=helper/cross" name="cross-selector">
        <span class="glyphicon glyphicon-random"></span>
      </ajax-button>
      <button type="button" class="btn btn-lg btn-danger" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>
    </div>
  </inputhelper>

</div>

<div class="main-menu-left">
  <ul>
    <li>
      <span>Содержание</span>
      <uL>
        <li class="active"><span>Новости</span></li>
        <li><span>Каталоги</span></li>
        <li><span>Контакты</span></li>
      </uL>
    </li>
    <li>
      <span>Магазин</span>
      <ul>
        <li><span>Корзина</span></li>
        <li><span>Заказы</span></li>
      </ul>
    </li>
    <li>
      <span>Настройки</span>
      <ul>
        <li><span>Профиль</span></li>
        <li><span>Баланс</span></li>
      </ul>
    </li>
  </ul>
</div>


<?php
  /* @var $this yii\web\View */
  $this->registerJs("$('.circle').tooltip({});");
  $this->registerJs("$('[data-toggle=\"dropdown\"').dropdown({});");