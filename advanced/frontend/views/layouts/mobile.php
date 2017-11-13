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
          <div class="search-input"><input ng-model="searchText"/></div>
          <div class="search-start"><button class="glyphicon glyphicon-search" ng-click="onSearch()"></button></div>
        </div>
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
  
  <div class="view">
    <div ng-view></div>
  </div>
  

<footer class="footer">    
  <p class="">&copy; АвтоТехСнаб <?= date('Y') ?></p>
</footer>
<!-- Grunt views place start -->
<!-- Angular views -->
 <!-- Collect from 'frontend/views/mobile//login-window.html' file -->
<script type="text/ng-template" id="/login-window.html">
<div class="login-window"><ul><li><div class="label">                <span>Логин</span></div></li><li><div class="field">                <input ng-model="login"/></div></li><li><div class="label">                <span>Пароль</span></div></li><li><div class="field"><input ng-model="pass"/></div></li><li><div class="label">                <label><input type="checkbox" ng-model="reuse"/> Запомнить меня</label></div></li></ul></div>
</script>
 <!-- Collect from 'frontend/views/mobile//menu-view.html' file -->
<script type="text/ng-template" id="/menu-view.html">
<div class="menu-main-area">  <ul>    <li><div class="menu-close"><span class="glyphicon glyphicon-chevron-left" style="float: left;top: 0.75rem;left: 1rem;"></span><span>Свернуть</span></div></li>    <li  ng-repeat="row in items">      <div class="menu-row" ng-click="onClick(row.key)"><span>{{row.name}}</span><span class="bubble" ng-show="{{row.bubble !== undefined}}">{{row.bubble}}</span></div>    </li>      </ul></div>   
</script>
 <!-- Collect from 'frontend/views/mobile//search-brands.html' file -->
<script type="text/ng-template" id="/search-brands.html">
<div class="brands-out"><div class="breadcrumb"><span>Поиск</span><span>{{searchText}}</span><span>Производители</span></div><div ng-if="inSearch" class="in-search"></div>      <div ng-if="!inSearch&&!count" class="count">Вариантов по запросу "<b>{{searchText}}</b>" не найдено</div><div ng-if="!inSearch&&count" class="count">Для запроса "<b>{{searchText}}</b>" найдено производителей: <b>{{count}}</b></div>    <div class="brand-tesaurus" id="tag_tesaurus"><ul><li ng-repeat="(letter,data) in brands track by $index"><a ng-click="goToTarget(letter)">{{letter}}</a>              </li>          </ul></div><div ng-repeat=" (letter,data) in brands track by $index" class="brand-header" id="tag{{letter}}"><div class="brand-title">            <a ng-click="titleShow[letter] = !titleShow[letter]">{{letter}}</a></div><div class="brand-list" ng-show="titleShow[letter]">            <div ng-repeat="(brand,bdata) in data track by $index" class="brand" ><a href="/parts/{{searchText}}/{{timestamp}}/{{brand}}">{{brand}}</a></div></div></div><div class="toUp" ng-show="isScroll" ng-click="goToTarget('_tesaurus')"><span class="glyphicon glyphicon-arrow-up"></span></div></div>
</script>
<!-- Grunt views place stop -->

<?php $this->endBody() ?>
</body>
<?php $this->endPage() ?>
</html>
