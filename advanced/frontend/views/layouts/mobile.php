<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use frontend\assets\MobileAsset;
use frontend\assets\AngularAsset;
use frontend\assets\MAppAsset;
use yii\helpers\Url;

$this->registerJs("var serverURL = '" . yii::$app->params['server_url']."';", \yii\web\View::POS_BEGIN);
MobileAsset::register($this);
AngularAsset::register($this);
MAppAsset::register($this); 
?>

<?php $this->beginPage() ?>

<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>" xmlns:ng="http://angularjs.org">
<head>
    <base href="/">
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="yandex-verification" content="dc8a298dfbad44c8" />
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body ng-app="atcCS" id="ng-app">
<?php $this->beginBody() ?>
  <div id="main-body">    
    <div id="menu-block" class="menu-block">&nbsp;</div>
    <div id="main-view"> 
      <div class="header" ng-controller="main-screen">
        <div class="top-line"><div class="paint">&nbsp;</div></div>
        <div class="logo"><a href="<?= Url::home();?>"><img src="img/logo_left.png"/></a></div>
        <div class="menu-button"><button ng-click="onMenuLoad()"><span class="glyphicon glyphicon-menu-hamburger"/></button></div>
        <div class="search-line">
          <div class="search-input"><input ng-model="searchText" id="search-input"/></div>
          <div class="search-start"><button class="glyphicon glyphicon-search" ng-click="onSearch()"></button></div>
        </div>
      </div>
      <div class="view">
        <div ng-view></div>
      </div>
    </div>
  </div>
  <div id="window">        
      <div class="header" ng-controller="main-screen">
        <div class="top-line"><div class="paint">&nbsp;</div></div>
        <div class="logo"><a href="<?= Url::home();?>"><img src="img/logo_left.png"/></a></div>        
      </div>
    <div class="window-close"><span class="glyphicon glyphicon-remove-circle"></span></div>
    <div class="window-body">
      &nbsp;
    </div>
    <div class="buttons">
      <button id="ok" ng-click="onOk">Ok</button>
      <button id="cancel" ng-click="onClose">Отмена</button>
    </div>
</div>
  
  
  

<footer class="footer">    
  <p class="">&copy; АвтоТехСнаб <?= date('Y') ?></p>
</footer>
<!-- Grunt views place start -->
<!-- Angular views -->
 <!-- Collect from 'frontend/views/mobile//basket.html' file -->
<script type="text/ng-template" id="/basket.html">
<div class="basket-view"><ul><li ng-repeat="row in parts | orderBy:'id'"><div class="line-a" ng-click="row.open=true;"><span>{{$index + 1}}.</span><span>{{row.articul}}</span><span>{{row.maker}}</span>                <span style="float: right">Заказ: {{row.sell_count}} шт.</span></div><div class="line-b"><span>{{row.name}}</span></div><div class="row-expand" ng-show="row.open===true"><ul><li>Добавлено: {{(row.date*1000) | date:'HH:mm:ss dd-MM-yyyy'}}</li>                      <li>Производитель: {{row.maker}}</li>                      <li>Артикул: {{row.articul}} <button class="btn-articul-search" ng-click="onArticulSearch(rows.articul)"><span class="glyphicon glyphicon-search"></span></button></li>                      <li>Наименование: {{row.name}}</li>                      <li>На складе: {{row.count}} шт.</li>                      <li>Упаковка: {{row.lot_quantity}} шт.</li>                      <li>Цена: {{row.price}} руб.</li>                    <li>Срок: от <u>{{row.shiping}} дн.</u></li>                      <li>Заказано  <input id="sell_count" type="number" step="{{row.lot_quantity}}" min="{{row.lot_quantity}}" max="{{row.count}}" ng-model="row.sell_count"/> шт.</li>                      <li>Комментарий <input id="comment" type="text" ng-model="row.comment"/></li>                    </ul><div class="actions"><button ng-click="onChange(row)">Изменить            <net-state ng-model="row.change"></net-state></button><button style="float: right" ng-click="row.open=false">Свернуть</button></div></div></li></ul>  </div>
</script>
 <!-- Collect from 'frontend/views/mobile//brands.html' file -->
<script type="text/ng-template" id="/brands.html">
 <div class="brands-view">   <div ng-if="inSearch" class="in-search"></div>   <div class="brands-list">     <ul>       <li ng-repeat="(brand,rule) in brands">         <span><a href="/parts/{{searchText}}/{{brand}}/{{rule}}">{{brand}}</a></span>       </li>     </ul>   </div>    </div>
</script>
 <!-- Collect from 'frontend/views/mobile//login-window.html' file -->
<script type="text/ng-template" id="/login-window.html">
<div class="login-window">  <ul>    <li>      <div class="label">                <span>Логин</span>      </div>    </li>    <li>      <div class="field">                <input ng-model="login"/>      </div>    </li>    <li>      <div class="label">                <span>Пароль</span>      </div>    </li>    <li>      <div class="field">        <input ng-model="pass"/>      </div>    </li>    <li>      <div class="label">                <label><input type="checkbox" ng-model="reuse"/> Запомнить меня</label>      </div>    </li>  </ul></div>
</script>
 <!-- Collect from 'frontend/views/mobile//menu-view.html' file -->
<script type="text/ng-template" id="/menu-view.html">
<div class="menu-main-area">  <ul>    <li><div class="menu-close"><span class="glyphicon glyphicon-chevron-left" style="float: left;top: 0.75rem;left: 1rem;"></span><span>Свернуть</span></div></li>    <li  ng-repeat="row in items">      <div class="menu-row" ng-click="onClick(row.key)"><span>{{row.name}}</span><span class="bubble" ng-show="{{row.bubble !== undefined}}">{{row.bubble}}</span></div>    </li>      </ul></div>   
</script>
 <!-- Collect from 'frontend/views/mobile//parts.html' file -->
<script type="text/ng-template" id="/parts.html">
<div class="parts-view">  <div class="parts-list"  ng-show="expand===undefined">    <ul>      <li ng-repeat="rows in data | orderBy:'name'">        <span>{{rows.name}}</span>        <button class="expand-button" ng-click="selectMaker(rows)"><span class="glyphicon glyphicon-chevron-right"></span></button>        <div class="name-info">          <span class="a">Цена <u>{{rows.min_price.price}}</u> руб. срок от <u>{{rows.min_price.shiping}} дн.</u></span>          <span class="b" ng-show="((rows.min_time.price!==rows.min_price.price) || (rows.min_price.shiping !==rows.min_time.shiping) ) ">Цена <u>{{rows.min_time.price}}</u> руб. срок от <u>{{rows.min_time.shiping}} дн.</u></span>        </div>      </li>    </ul>      </div>    <div class="parts-expand"  ng-show="expand!==undefined">    <ul>      <li><div ng-click="expand=undefined" class="back"><span class="glyphicon glyphicon-chevron-left icon-back" ></span><span class="brand-name">{{expand.name}}</span><span class="back">Назад</span></div></li>      <li>        <div class="parts-control">          <span ng-click="sortBy('price')">Цена <div ng-show="sort.name==='price'"><span class="glyphicon" ng-class="sort.order===1?'glyphicon-triangle-bottom':'glyphicon-triangle-top'"></span></div></span>          <span ng-click="sortBy('shiping')">Срок <div ng-show="sort.name==='shiping'"><span class="glyphicon" ng-class="sort.order===1?'glyphicon-triangle-bottom':'glyphicon-triangle-top'"></span></div></span>        </div>      </li>      <li ng-repeat="rows in expand.rows | orderBy:sort.name:(sort.order==1)">        <div class="row-head" ng-click="rows.open=true"><span class="articul">{{rows.articul}}</span></div>        <div class="row-info"><span>Цена <u>{{rows.price}}</u> руб. срок от <u>{{rows.shiping}} дн.</u> есть <u>{{rows.count}} шт.</u></span></div>        <div class="row-expand" ng-show="rows.open">          <ul>            <li>Производитель: {{rows.maker}}</li>                        <li>Артикул: {{rows.articul}} <button class="btn-articul-search" ng-click="onArticulSearch(rows.articul)"><span class="glyphicon glyphicon-search"></span></button></li>                        <li>Наименование: {{rows.name}}</li>                        <li>На складе: {{rows.count}} шт.</li>                        <li>Упаковка: {{rows.lot_quantity}} шт.</li>                        <li>Цена: {{rows.price}} руб.</li>            <li>Цена [{{activeMarkupName}} ({{activeMarkup}}%)]: <u>{{rows.price | percent:activeMarkup | number:2}} руб.</u></li>                        <li>Срок: от <u>{{rows.shiping}} дн.</u></li>                      </ul>          <div class="actions">            <button ng-click="onAdd(rows)">В корзину              <net-state ng-model="rows.adding"></net-state>            </button>            <button style="float: right" ng-click="rows.open=false">Свернуть</button>          </div>        </div>      </li>    </ul>      </div>  </div>
</script>
 <!-- Collect from 'frontend/views/mobile//select-basket-window.html' file -->
<script type="text/ng-template" id="/select-basket-window.html">
<div class="basket-window"><ul><li>          </li></ul></div>
</script>
 <!-- Collect from 'frontend/views/mobile//select-markup-window.html' file -->
<script type="text/ng-template" id="/select-markup-window.html">
<div class="markup-window"><ul><li ng-repeat="mp in markups|orderBy:'v'">       <span class="glyphicon glyphicon-ok" ng-show="$parent.selectedMarkup===mp"></span><span ng-click="$parent.selectedMarkup=mp">{{mp.n}} ( {{mp.v}}% )</span></li></ul></div>
</script>
<!-- Grunt views place stop -->

<?php $this->endBody() ?>
</body>
<?php $this->endPage() ?>
</html>
