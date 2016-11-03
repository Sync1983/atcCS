<?php use yii\helpers\Url; ?>
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
  <search-line ng-model="query">

  </search-line>
</div>
<!-- Блок меню -->
<div class="main-menu-left">  
  <ul class="menu-line">
    <li> <a href="#">Новости</a>  <div class="divider"></div></li>
    <li> <a href="catalog">Каталоги</a> <div class="divider"></div></li>
    <li> <a href="#">Контакты</a> <div class="divider"></div></li>
    <li> <a href="basket">  Корзина</a>  <div class="divider"></div></li>
    <li> <a href="orders">  Заказы</a>   <div class="divider"></div></li>
    <li> <a href="#">Профиль</a>  <div class="divider"></div></li>
    <li> <a href="#">Баланс</a>   <div class="divider"></div></li>
    <li class="helper "></li>
  </ul>
</div>

<div class="login-menu" ng-controller="headControl" ng-submit="onLogin();" ></div>