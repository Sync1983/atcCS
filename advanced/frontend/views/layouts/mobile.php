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
  <div class="header">
    <div class="top-line">
      <div class="paint">
        &nbsp;
      </div>
    </div>
    <div class="logo">  
      <a href="<?= Url::home();?>"><img src="img/logo_left.png"/></a>  
    </div>
    <div class="menu-button">
      <button ng-click="onMenuLoad">
        <span class="glyphicon glyphicon-menu-hamburger"/>
      </button>
    </div>
  </div>
  
<footer class="footer">    
  <p class="">&copy; АвтоТехСнаб <?= date('Y') ?></p>
</footer>
<!-- Grunt views place start -->

<!-- Grunt views place stop -->

<?php $this->endBody() ?>
</body>
<?php $this->endPage() ?>
</html>
