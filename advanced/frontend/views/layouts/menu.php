<?php
use yii\helpers\Url;

?>

<div class="head" style="text-align: center">
  <div class="head-logo">
    <a href="<?= Url::home();?>">
      <img class="hidden-sm-down hidden-xs-down" src="img/logo_left.png"/>
      <img class="hidden-md-up hidden-lg-up hidden-xl-up" src="img/logo_left_min.png"/>
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
    <p class="hidden-md-down hidden-lg-down"><img src="img/callus.png"/>+7 (8412) 763-533<img src="img/callus.png"/>+7 (8412) 518-302</p>
    <p class="hidden-xl-up" style="left:12%; width: 55%; font-size: 1em;"><img src="img/callus.png"/>+7 (8412) 763-533</p>
    <p class="hidden-md-down hidden-sm-down"><img src="img/mail.png"/><a href="mailto:sales@atc58.ru">sales@atc58.ru</a></p>
    <p class="hidden-md-down"><img src="img/skype.png"/><a href="skype:atc_58">АвтоТехСнаб(atc_58)</a></p>
</div>

<?php
  /* @var $this yii\web\View */
  $this->registerJs("$('.circle').tooltip({});");
?>