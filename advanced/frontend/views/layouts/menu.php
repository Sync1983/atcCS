<?php
use yii\helpers\Url;

?>

<div class="head" style="text-align: center">
  <div class="head-logo">
    <a href="<?= Url::home();?>">
      <img class="hidden-md-down" src="img/logo_left.png"/>
      <img class="hidden-lg-up" src="img/logo_left_min.png"/>
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
    <p class="hidden-md-down"><img src="img/callus.png"/>+7 (8412) 763-533<img src="img/callus.png"/>+7 (8412) 518-302</p>
    <p class="hidden-lg-up"><img src="img/callus.png"/>+7 (8412) 763-533</p>
    <p class="hidden-lg-up"><img src="img/callus.png"/>+7 (8412) 518-302</p>
    <p class="hidden-sm-down"><img src="img/mail.png"/><a href="mailto:sales@atc58.ru">sales@atc58.ru</a></p>
    <p class="hidden-md-down"><img src="img/skype.png"/><a href="skype:atc_58">АвтоТехСнаб(atc_58)</a></p>
</div>
<div class="search-bar row-md-top row" ng-controller="searchControl">
<!-- Список каталогов для перехода -->
  <div class="dropdown col-md-first col-md-2">
    <button class="btn btn-info disabled" id="catalog-btn" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Каталоги
    <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" aria-labelledby="catalog-btn">
    ...
  </ul>
  </div>
<!-- Строка поиска и список выбора -->
  <div class="dropdown col-md-8" id='searchFilter'>
    <input  ng-change='change()'
            ng-model='query'
            ng-value='selected'
            ng-app=""placeholder='Введите артикул запчасти... '
            type='text'
            xng-focus='cleared'
            class='form-control'
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">    
    <ul ng-show='query' class='dropdown-menu' aria-labelledby="searchFilter">
      <li ng-click='select(item)' ng-repeat='item in items | filter: query'>
        {{item}}
      </li>
    </ul>
  </div>
<!-- Флаг отображения аналогов -->
  <div class="col-md-2">
    <label for="analog-show" class="btn btn-info">Аналоги</label>
    <checkbox ng-model="analogShow" name="asd " id="analog-show" class="btn-info"/>
  </div>
<!-- Кнопка выбора процентов -->
  <ui-select   class="col-md-2 markup-selector btn btn-info"
               ng-model="markup.selected"
               reset-search-input="false"
               ng-disabled="disabled"
               search-enabled="true"
               append-to-body="true">

    <ui-select-match>{{$select.selected.n}} ({{$select.selected.v}} %)</ui-select-match>
    
    <ui-select-choices repeat="mark in user.markup track by $index">
      <div ng-bind-html="mark.n | highlight: $markup.search.n"></div>
      <small>
        Размер: {{mark.v}}%
      </small>
    </ui-select-choices>
  </ui-select>
</div>  

<?php
  /* @var $this yii\web\View */
  $this->registerJs("$('.circle').tooltip({});");
  $this->registerJs("$('[data-toggle=\"dropdown\"').dropdown({});");