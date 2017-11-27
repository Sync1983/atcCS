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
          <div class="search-input"><input ng-model="searchText.text" id="search-input"/></div>
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
<div class="parts-view">  <div class="parts-list"  ng-show="expand===undefined">    <ul>      <li ng-repeat="(brand,rows) in data">        <span>{{brand}}</span>        <button class="expand-button" ng-click="selectMaker(brand)"><span class="glyphicon glyphicon-chevron-right"></span></button>      </li>    </ul>      </div>    <div class="parts-expand"  ng-show="expand!==undefined">    <ul>      <li>        <div class="parts-control">          <span><span class="glyphicon glyphicon-chevron-left"></span>Назад</span>          <span ng-click="sortBy('price')">Цена <div ng-show="sort.name='price'"><span class="glyphicon" ng-class="sort.order===1?'glyphicon-triangle-bottom':'glyphicon-triangle-top'"></span></div></span>          <span>Срок</span>        </div>      </li>      <li ng-repeat="rows in data[expand]">        <div class="row-head"><span class="articul">{{rows.articul}}</span><span class="name">{{rows.name}}</span></div>        <div class="row-info"><span>Цена <b>{{rows.price}}</b> руб. срок от <b>{{rows.shiping}}</b> дн.</span></div>              </li>    </ul>      </div>  </div>
</script>
<!-- Grunt views place stop -->

<?php $this->endBody() ?>
</body>
<?php $this->endPage() ?>
</html>
