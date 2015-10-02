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
        <div class="container-fluid">
          <div ng-view></div>
        </div>
    </div>
</div>

<footer class="footer">
    <div class="container-fluid">
        <p class="pull-left">&copy; АвтоТехСнаб <?= date('Y') ?></p>
        <p class="pull-right"><?= Yii::powered() ?></p>
    </div>
</footer>

<?php $this->endBody() ?>
</body>
<!-- Grunt views place start -->
<!-- Angular views -->
 <!-- Collect from 'views/site/angular//ajax-button.html' file -->
<script type="text/ng-template" id="/ajax-button.html">
<button class="ajax-button"><div ng-transclude ng-click="toggle()"></div><div class="ajax-button-helper" ng-show="visible"><div class="ajax-button-header">      {{title}}    </div>    </div>  </button>
</script>
 <!-- Collect from 'views/site/angular//input-help.html' file -->
<script type="text/ng-template" id="/input-help.html">
<div class="input-helper"><input ng-model="data.inputValue" type="text" class="input-input" ng-class="{{inputClass}}" placeholder="{{placeholder}}" ng-change="change()" ng-click="toggle()"/><span ng-if="!visible && (count>0)" class="icon glyphicon glyphicon-download"></span>    <span ng-if="visible && (count>0)" class="icon glyphicon glyphicon-upload"></span>    <ul class="input-select-helper" ng-show="visible"><li ng-if="count !== 0" style="text-align:center;"><input type="text" class="search-filter form-control" ng-model="data.filters" ng-change="subfilter()" placeholder="Найти в найденом"/>            <span> Всего вариантов {{count}} </span></li><li ng-if="count === 0">       <strong>Вариантов не найдено</strong></li><li ng-repeat="item in list" inject></li>   </ul>  </div>
</script>
 <!-- Collect from 'views/site/angular//main-page.html' file -->
<script type="text/ng-template" id="/main-page.html">
<!DOCTYPE html><!-- --><html><head><title>TODO supply a title</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div>TODO write content</div></body></html>
</script>
 <!-- Collect from 'views/site/angular//modal-window.html' file -->
<script type="text/ng-template" id="/modal-window.html">
<div class="modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">{{ title }}</h4></div><div class="modal-body" ng-transclude></div></div></div> </div>
</script>
<!-- Grunt views place stop -->
</html>
<?php $this->endPage() ?>
