<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use frontend\assets\AppAsset;
use frontend\assets\AngularAsset;
use frontend\assets\AngularSelectAsset;
use frontend\assets\AAppAsset;
use common\widgets\Alert;

AppAsset::register($this);
AngularAsset::register($this);
AAppAsset::register($this);
?>

<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>" xmlns:ng="http://angularjs.org">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>    
    <?php $this->head() ?>
</head>
<body ng-app="atcCS" id="ng-app">
<?php $this->beginBody() ?>

<div class="wrap">
  <div class="container-fluid">
    <?php $this->beginContent('@app/views/layouts/menu.php');
          $this->endContent(); ?>
    <div ng-view class="view">&nbsp;</div>
  </div>
  <div class="tray-bar">
    
  </div>
</div>

<footer class="footer">
    <div class="container-fluid">
        <p class="">&copy; АвтоТехСнаб <?= date('Y') ?></p>
        <p class=""><?= Yii::powered() ?></p>
    </div>
</footer>
  
<!-- Grunt views place start -->
<!-- Angular views -->
 <!-- Collect from 'frontend/views/site/angular//ajax-button.html' file -->
<script type="text/ng-template" id="/ajax-button.html">

</script>
 <!-- Collect from 'frontend/views/site/angular//input-help.html' file -->
<script type="text/ng-template" id="/input-help.html">
<div class="input-helper">  <div class="input-group">    <input ng-model="data.inputValue" type="text" class="input-input" ng-class="{{inputClass}}" placeholder="{{placeholder}}" ng-change="change()" ng-click="toggle()"/>        <span class="input-group-btn">      <button class="btn btn-atc">Искать</button>    </span>  </div>  <div class="btn-group">    <span class="icon glyphicon glyphicon-cog"  ng-click="toggle();"></span>          <span ng-if="!visible && (count>0)" class="icon glyphicon glyphicon-download" ng-click="toggle();"></span>      <span ng-if="visible && (count>0)" class="icon glyphicon glyphicon-upload"  ng-click="toggle();"></span>    </div>  <ul class="input-select-helper" ng-show="visible">    <li ng-if="count !== 0" style="text-align:center;">      <input type="text" class="search-filter form-control" ng-model="data.filters" ng-change="subfilter()" placeholder="Найти в списке"/>            <span> Всего вариантов {{count}} </span>    </li>    <li ng-if="count === 0">       <strong>Вариантов не найдено</strong>    </li>    <li ng-repeat="item in list" inject></li>   </ul>  </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//main-page.html' file -->
<script type="text/ng-template" id="/main-page.html">
<!DOCTYPE html><!-- --><html>  <head>    <title>TODO supply a title</title>    <meta charset="UTF-8">    <meta name="viewport" content="width=device-width, initial-scale=1.0">  </head>  <body>    <div>TODO write content</div>  </body></html>
</script>
 <!-- Collect from 'frontend/views/site/angular//modal-window.html' file -->
<script type="text/ng-template" id="/modal-window.html">
<div class="modal">  <div class="modal-dialog">    <div class="modal-content">      <div class="modal-header">        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>        <h4 class="modal-title">{{ title }}</h4>      </div>      <div class="modal-body" ng-transclude></div>    </div>  </div> </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_articul-info-part.html' file -->
<script type="text/ng-template" id="/parts/_articul-info-part.html">
<div class="articuls-info" ng-controller="articulListController">  <div class="row-line">    <div class="sub-row">      <strong>Информация по артикулу:</strong><br>          </div>    <div class="sub-row">      <label>Артикул</label><span>{{number}}</span><br>    </div>    <div class="sub-row">      <label>Производитель</label><span>{{supplier}}</span><br>    </div>    <div class="sub-row">      <label>Описание</label><span>{{description}}</span>    </div>  </div>  <div class="row-line">    <div class="sub-row">      <strong>Варианты замены:</strong><br>          </div>  </div>  <ul>        <li ng-repeat="item in cross" articul-id="{{item.id}}">            <div class="sub-row" ng-switch on="item.type">        <label>Номер</label>          <span><strong>{{item.full_number}}[{{item.number}}]</strong></span>          <span ng-switch-when="1">Номер производителя</span>          <span ng-switch-when="2">?</span>          <span ng-switch-when="3">Оригинальный номер</span>          <span ng-switch-when="4">Аналог</span>          <span ng-switch-when="5">?</span>      </div>            <div class="sub-row">        <label>Производитель</label><span>{{item.brand}}</span>      </div>            <button ng-click="onLoadArticulInfo(item);" class="btn pull-right load-info" title="Информация по артикулу"><span class="glyphicon glyphicon-list-alt"></span></button>    </li>  </ul>  </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_car-select-articul-part.html' file -->
<script type="text/ng-template" id="/parts/_car-select-articul-part.html">
<div class="articuls-list" ng-controller="articulListController">  <div class="row-line">    <div class="sub-row">      <strong>Информация по запросу:</strong><br>          </div>    <div class="sub-row">      <label>Марка:</label><span ng-repeat="mfcItem   in mfc"  >{{mfcItem.text}}</span><br>    </div>    <div class="sub-row">      <label>Модель</label><span ng-repeat="modelItem in model">{{modelItem.text}}</span><br>    </div>    <div class="sub-row">      <label>Описание</label><span ng-repeat="descrItem in descr">{{descrItem.text}}</span>    </div>  </div>  <ul>    <li ng-repeat="item in items" articul-id="{{item.id}}">      <label>Номер</label><span><strong>{{item.number}}</strong></span><br>      <label>Описание</label><span>{{item.desc}}</span>      <button ng-click="onLoadArticulInfo(item);" class="btn pull-right load-info" title="Информация по артикулу"><span class="glyphicon glyphicon-list-alt"></span></button>    </li>  </ul>  </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_car-select-group.html' file -->
<script type="text/ng-template" id="/parts/_car-select-group.html">
<div>    <tree ng-model="treeModel">      </tree>  </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_car-select-part.html' file -->
<script type="text/ng-template" id="/parts/_car-select-part.html">
<div class="car-select">    <div class='row-line' id='tags' ng-show='tagsCtrl.length()'>      </div>    <div class="row-line">    <sinput class="car-select-input"             placeholder="Введите производителя или марку автомобиля111"             name="mmodel"             ng-model="filter"             submit="false">                </sinput>  </div>    <tree ng-model="typeSelector" filter="{{filter}}">      </tree>    <!--  <div class="row-line" ng-show="selector.mfcs.length">    <label class='title'>Подходящие производители</label>    <ul>      <li ng-repeat="item in selector.mfcs" ng-click="onSelectMModel(item)" ng-bind-html="item.trustedHtml">        <span>{{ item.trustedHtml }}</span>      </li>    </ul>  </div>    <div class="row-line" ng-show="selector.models.length">    <label class='title'>Подходящие модели</label>    <ul>      <li ng-repeat="item in selector.models" ng-click="onSelectMModel(item)" ng-bind-html="item.trustedHtml">        <span>{{ item.trustedHtml }}</span>      </li>    </ul>  </div>    <div class="row-line" ng-show="selector.showDescr">    <sinput class="car-select-input"             placeholder="Введите описание детали"             name="descr"             ng-model="selector.descr"             submit="true"       submit-function="onDescrFind()">                </sinput>  </div>  <div class="row-line" ng-show="selector.showDescr">    <a href="#" ng-click="onShowPartTree();">Выбрать из списка</a>  </div>    <div class="row-line" ng-show="selector.descriptions.length">    <label class='title'>Подходящие описания</label>    <ul>      <li ng-repeat="item in selector.descriptions" ng-click="onSelectMModel(item)" ng-bind-html="item.trustedHtml">        <span>{{ item.trustedHtml }}</span>      </li>    </ul>  </div>  --></div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_login-part.html' file -->
<script type="text/ng-template" id="/parts/_login-part.html">
<?php $form = yii\widgets\ActiveForm::begin([        'options' => [          'class' => 'login-form'       ]    ]);?><div class="row-line">  <sinput class="login-input" placeholder="Введите логин или адрес почты" name="login" ng-model="login.name" submit="true" submit-function="onLogin()"></sinput></div><div class="row-line">  <sinput class="login-input" placeholder="Введите пароль" name="password" ng-model="login.password" submit="true" submit-function="onLogin()"></sinput></div><div class="row-line" style="text-align:center;">  <scheckbox name="rememberMe" label="Запомнить меня" ng-model="login.remember"/></div><div class="row-line" style="text-align:center;">  <label ng-click="onLogin()">Войти</label>  <label>Регистрация</label></div>    <?php yii\widgets\ActiveForm::end();?>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_sinput.html' file -->
<script type="text/ng-template" id="/parts/_sinput.html">
<div class="sinput">  <input class="sinput"          placeholder="{{placeholder}}"          value="{{value}}"          name="{{name}}"          ng-value="value"          ng-model="model"/>  </div> 
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_tile-selector.html' file -->
<script type="text/ng-template" id="/parts/_tile-selector.html">
<div class="tile-selector">  asd</div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_tree-part.html' file -->
<script type="text/ng-template" id="/parts/_tree-part.html">
<div class="tree-view" >  <ul>      </ul>  </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//search-line.html' file -->
<script type="text/ng-template" id="/search-line.html">
<div class="search-line">  <input type="text" id="search-text" placeholder="Номер детали или её описание" ng-model="text"/>  <div class="search-icons">    <ul>      <li><button id="search-sub"><span class="glyphicon glyphicon-download"></span></button></li>      <li><button id="search-cars"><span class="glyphicon cars"></span></button></li>      <li><button id="search-cfg"><span class="glyphicon glyphicon-cog"></span></button></li>      <li><button id="search-request"><span class="glyphicon glyphicon-search"></span></button></li>    </ul>  </div>  </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//window.html' file -->
<script type="text/ng-template" id="/window.html">
<div class="window">  <div class="header"></div>  <div class="sysicons">    <button class="minimize">      <span class="glyphicon glyphicon-save"></span>          </button>    <button class="destroy">      <span class="glyphicon glyphicon-remove"></span>    </button>  </div>  <div class="content">      </div>  <div class="statusbar">  </div>  <div class="resize"><span class="glyphicon glyphicon-chevron-right"></span></div></div>
</script>
<!-- Grunt views place stop -->

<?php $this->endBody() ?>
</body>
<?php $this->endPage() ?>
</html>