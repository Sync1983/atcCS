<?php
use yii\helpers\Url;

?>

<!-- Строка контактов -->
<div class="info">
  <div class="header-up">
    <div>&nbsp;</div>
  </div>
  <div class="text-info">
    <span><img src="img/callus.png"/>+7 (8412) 763-533</span>
    <span><img src="img/callus.png"/>+7 (8412) 518-302</span>
    <span><img src="img/mail.png"/><a href="mailto:sales@atc58.ru">sales@atc58.ru</a></span>
    <span><img src="img/skype.png"/><a href="skype:atc_58">АвтоТехСнаб(atc_58)</a></span>
  </div>
</div>
<!-- Основной логотип -->
<div class="head-logo">  
  <a href="<?= Url::home();?>"><img src="img/logo_left.png"/></a>  
</div>
<!-- Строка поиска и список выбора -->
<div class="search-bar row-md-top btn-group-justified" ng-controller="searchControl">
  
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
<!-- Блок меню -->
<div class="main-menu-left">  
  <ul class="menu-line">
    <li> <a href="#">Новости</a>  <div class="divider"></div></li>
    <li> <a href="#">Каталоги</a> <div class="divider"></div></li>
    <li> <a href="#">Контакты</a> <div class="divider"></div></li>
    <li> <a href="#">Корзина</a>  <div class="divider"></div></li>
    <li> <a href="#">Заказы</a>   <div class="divider"></div></li>
    <li> <a href="#">Профиль</a>  <div class="divider"></div></li>
    <li> <a href="#">Баланс</a>   <div class="divider"></div></li>
    <li class="helper "></li>
  </ul>
</div>

<div class="login-menu" ng-controller="headControl">
  <window title="Авторизация">
    asd
  </window>
</div>

    <!--<li>
      <span>Авторизация</span>
      <?php $form = yii\widgets\ActiveForm::begin([
         'options' => [
          'class' => 'login-form'
         ]
      ]);?>
      <div class="row-line">
        <sinput class="login-input" value="" placeholder="Введите логин или адрес почты" name="login" ></sinput>
      </div>
      <div class="row-line">
        <sinput class="login-input" value="" placeholder="Введите пароль" name="password" ></sinput>
      </div>
      <div class="row-line">
        <scheckbox name="rememberMe" />
        <label>Запомнить меня</label>
      </div>
      <?php yii\widgets\ActiveForm::end();?>
    </li>

  <footer class="footer">
    <div class="container-fluid">
        <p class="">&copy; АвтоТехСнаб <?= date('Y') ?></p>
        <p class=""><?= Yii::powered() ?></p>
    </div>
</footer>-->


<?php
  /* @var $this yii\web\View */
  //$this->registerJs("$('.circle').tooltip({});");
  //$this->registerJs("$('[data-toggle=\"dropdown\"').dropdown({});");