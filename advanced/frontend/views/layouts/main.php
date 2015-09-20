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
    <div class="container">
        <p class="pull-left">&copy; АвтоТехСнаб <?= date('Y') ?></p>
        <p class="pull-right"><?= Yii::powered() ?></p>
    </div>
</footer>

<?php $this->endBody() ?>
</body>
<!-- Grunt views place start -->
<!-- Angular views -->
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
