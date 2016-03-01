<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use frontend\assets\AppAsset;
use frontend\assets\AngularAsset;
use frontend\assets\AngularSelectAsset;
use frontend\assets\AAppAsset;
use common\widgets\Alert;
$this->registerJs("var serverURL = '" . yii::$app->params['server_url']."';", \yii\web\View::POS_BEGIN);
AppAsset::register($this);
AngularAsset::register($this);
AAppAsset::register($this);
?>

<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>" xmlns:ng="http://angularjs.org">
<head>
    <base href="/">
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
    <div class="view">
      <div ng-view></div>
    </div>
  </div>
  <div class="tray-bar">  </div>
  <div class="notifications">  </div>
</div>

<footer class="footer">
    <div class="container-fluid">
        <p class="">&copy; АвтоТехСнаб <?= date('Y') ?></p>
        <p class="powerd-by"><?= Yii::powered() ?></p>
    </div>
</footer>

<!-- Grunt views place start -->
<!-- Angular views -->
 <!-- Collect from 'frontend/views/site/angular//ajax-button.html' file -->
<script type="text/ng-template" id="/ajax-button.html">

</script>
 <!-- Collect from 'frontend/views/site/angular//basket.html' file -->
<script type="text/ng-template" id="/basket.html">
<div class="basket">  <h5 ng-show="!isLogin">Просмотр корзины доступен только авторизованным пользователям</h5>  <h5 ng-show="isLogin">Позиции корзины: <u>{{basketName}}</u></h5>  <div>    <table ng-table="tableParams" class="table table-condensed table-bordered table-striped">          <colgroup>                <col width="2%"/>        <col width="5%"/>        <col width="5%"/>        <col width="20%"/>        <col width="2%"/>        <col width="2%"/>        <col width="2%"/>        <col width="2%"/>        <col width="5%"/>        <col width="2%"/>      </colgroup>      <tr ng-repeat="row in $data track by row.id" ng-show="!row.hide" ng-class="{'selected':(row.selected)}">                <td data-title="'Добавлено'"        sortable="'date'"         ><span title="{{row.date | date:'dd/MM/yyyy HH:mm'}}">{{row.date | date:'dd/MM/yyyy'}}</span></td>        <td data-title="'Артикул'"          sortable="'articul'"      > {{row.articul}}</td>        <td data-title="'Производитель'"    sortable="'maker'"        > {{row.maker}}</td>        <td data-title="'Название'"         sortable="'name'"         > {{row.name}}</td>        <td data-title="'Количество'"       sortable="'sell_count'"   > {{row.sell_count}}</td>        <td data-title="'Срок'"             sortable="'shiping'"      > {{row.shiping}}</td>        <td data-title="'Цена'"             sortable="'price'"        > {{row.price | number:2}}</td>        <td data-title="'Сумма'"            sortable="'sum'"          > {{row.price*row.sell_count | number:2}}</td>        <td data-title="'Комментарий'"      sortable="'commnet'"      > {{row.comment}}</td>        <td data-title="'Действия'"                                   >                     <div class="btn-group" role="group">            <button type="button" class="btn btn-default btn-icon" title="Удалить"       ng-click="delete(row);"><span class="glyphicon glyphicon-erase"></span></button>            <button type="button" class="btn btn-default btn-icon" title="Редактировать" ng-click="edit(row);"  ><span class="glyphicon glyphicon-pencil"></span></button>            <button type="button" class="btn btn-default btn-icon" title="Заказать"      ng-click="order(row);" >              <span class="glyphicon glyphicon-plus"  ng-show="!row.selected"></span>                <span class="glyphicon glyphicon-minus"  ng-show="row.selected"></span>              </button>          </div>        </td>      </tr>    </table>  </div>  <div class="row-line" style="text-align: center;" ng-show="selected">    <button class="btn btn-info">Заказать {{selected}} позиций(-ю)</button>  </div></div>
</script>
 <!-- Collect from 'frontend/views/site/angular//main-page.html' file -->
<script type="text/ng-template" id="/main-page.html">
MainPage
</script>
 <!-- Collect from 'frontend/views/site/angular//modal-window.html' file -->
<script type="text/ng-template" id="/modal-window.html">
<div class="modal">  <div class="modal-dialog">    <div class="modal-content">      <div class="modal-header">        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>        <h4 class="modal-title">{{ title }}</h4>      </div>      <div class="modal-body" ng-transclude></div>    </div>  </div> </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts-list.html' file -->
<script type="text/ng-template" id="/parts-list.html">
<div class="parts-out">  <div class="breadcrumb">    <span>Поиск</span>    <span>{{searchText}}</span>    <span><a href="/brands/{{searchText}}/{{timestamp}}">Производители</a></span>    <span>{{brand}}</span>  </div>  <div ng-if="inSearch" class="in-search"></div>      <div ng-if="!inSearch" class="count">Варианты деталей по запросу "<b>{{searchText}}</b>" от производителя <b>{{brand}}</b>:</div>      <table ng-table="tableParams" class="table table-condensed table-bordered table-striped">        <colgroup>      <col width="10%"/>      <col width="15%"/>      <col width="40%"/>      <col width="8%"/>      <col width="8%"/>      <col width="8%"/>      <col width="8%"/>    </colgroup>        <tr class="ng-table-group" ng-repeat-start="group in $groups | partOut:brand:true">          <td colspan="7">            <a href="" ng-click="group.$hideRows = !group.$hideRows">              <span class="glyphicon" ng-class="{ 'glyphicon-chevron-right': group.$hideRows, 'glyphicon-chevron-down': !group.$hideRows }"></span>              <strong>{{ group.value }}</strong>            </a>          </td>                  </tr>        <tr ng-hide="group.$hideRows" ng-repeat="row in group.data" ng-repeat-end            ng-class="(String(row.articul).toUpperCase()===searchText.toUpperCas())? 'original' :''">            <td data-title="'Производитель'" sortable="'maker'">{{row.maker}}</td>          <td data-title="'Артикул'" sortable="'articul'">{{row.articul}}</td>          <td data-title="'Наименование'" class="name"><span title='{{row.name}}'>{{row.name}}</span></td>          <td data-title="'Цена'" sortable="'viewPrice'">{{row.viewPrice}}</td>          <td data-title="'Срок'" sortable="'shiping'">{{row.shiping}}</td>          <td data-title="'Наличие'" sortable="'count'">{{row.count}}</td>          <td data-title="'В корзину'">            <a href='#' ng-click="Add(row.key)" ng-show="isLogin&&!row.adding&&!row.error">Добавить</a>            <span class="load-info" ng-show="row.adding"></span>          </td>        </tr>      </table></div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_articul-info-part.html' file -->
<script type="text/ng-template" id="/parts/_articul-info-part.html">
<div class="articuls-info">    <div class="preloader" ng-if="!id "></div>  <div class="row-line">    <div class="sub-row">      <strong>Информация по артикулу:</strong><br>          </div>    <div class="sub-row">      <label>Артикул</label><span>{{number}}</span><br>    </div>    <div class="sub-row">      <label>Производитель</label><span>{{supplier}}</span><br>    </div>    <div class="sub-row">      <label>Описание</label><span>{{description}}</span>    </div>  </div>  <div class="row-line">    <div class="sub-row">      <strong>Варианты замены:</strong><br>          </div>  </div>  <ul>        <li ng-repeat="item in cross track by $index" articul-id="{{item.aid}}">            <div class="sub-row" ng-switch on="item.type">        <label>Номер</label>          <span><strong>{{item.full_number}}[{{item.number}}]</strong></span>          <span ng-switch-when="1">Номер производителя</span>          <span ng-switch-when="2">?</span>          <span ng-switch-when="3">Оригинальный номер</span>          <span ng-switch-when="4">Аналог</span>          <span ng-switch-when="5">?</span>      </div>            <div class="sub-row">        <label>Производитель</label><span>{{item.brand}}</span>      </div>            <button ng-click="onLoadArticulInfo(item);" class="btn pull-right load-info" title="Информация по артикулу"></button>    </li>  </ul>  </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_basket-edit.html' file -->
<script type="text/ng-template" id="/parts/_basket-edit.html">
<div class="basket-edit">  <div class="row-line">    <label>Добавлено</label><span>{{editPart.date| date:'dd/MM/yyyy HH:mm:ss'}}</span>  </div>  <div class="row-line">    <label>Артикул</label><span>{{editPart.articul}}</span>  </div>  <div class="row-line">    <label>Производитель</label><span>{{editPart.maker}}</span>  </div>  <div class="row-line">    <label>Название</label><span>{{editPart.name}}</span>  </div>  <div class="row-line">    <label>Доступно</label><span>{{editPart.count}} шт.</span>  </div>  <div class="row-line">    <label>Партия</label><span>{{editPart.lot_quantity}} шт.</span>  </div>  <div class="row-line">    <label>Срок</label><span>{{editPart.shiping}} дн.</span>  </div>  <div class="row-line">    <label>Цена</label><span>{{editPart.price}} руб.</span>  </div>  <div class="row-line">    <label>Количество</label>    <div class="input">      <sinput         placeholder="Введите количество деталей для заказа"         name="sell_count"         ng-model="editPart.sell_count"         submit="false"         type="number"         step="{{editPart.lot_quantity}}"         min="{{editPart.lot_quantity}}"         max="{{editPart.count}}"        changeFunction ="onCountChange"        >      </sinput>    </div>  </div>  <div class="row-line">    <label>Комментарий</label>    <div class="input"><sinput placeholder="Введите коментарий для детали" name="comment" ng-model="editPart.comment" submit="false"></sinput></div>  </div>  <div class="row-line">    <label>Сумма</label><span>{{editPart.price * editPart.sell_count | number:2}} руб.</span>  </div>  <div class="row-line">    <span class="error" ng-show="error">{{error}}</span>  </div></div> 
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_car-select-articul-part.html' file -->
<script type="text/ng-template" id="/parts/_car-select-articul-part.html">
<div class="articuls-list" ng-controller="articulListController">  <div class="row-line">    <div class="sub-row">      <strong>Информация по запросу:</strong><br>          </div>    <div class="sub-row">      <label>Марка:</label><span ng-repeat="mfcItem   in mfc"  >{{mfcItem.text}}</span><br>    </div>    <div class="sub-row">      <label>Модель</label><span ng-repeat="modelItem in model">{{modelItem.text}}</span><br>    </div>    <div class="sub-row">      <label>Описание</label><span ng-repeat="descrItem in descr">{{descrItem.text}}</span>    </div>  </div>  <ul>    <li ng-repeat="item in items" articul-id="{{item.id}}">      <label>Номер</label><span><strong>{{item.number}}</strong></span><br>      <label>Описание</label><span>{{item.desc}}</span>      <button ng-click="onLoadArticulInfo(item);" class="btn pull-right load-info" title="Информация по артикулу"><span class="glyphicon glyphicon-list-alt"></span></button>    </li>  </ul>  </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_car-select-group.html' file -->
<script type="text/ng-template" id="/parts/_car-select-group.html">
<div class="group-info">    <div class="car-info" ng-repeat="info in typeInfo">    <div class="row-line">      <span class="head">Название:</span><span title="{{info.name}} [c {{info.start.getDate()}}-{{info.start.getMonth()}}-{{info.start.getFullYear()}} по {{info.end.getDate()}}-{{info.end.getMonth()}}-{{info.end.getFullYear()}}]">{{info.name}} [c {{info.start.getDate()}}-{{info.start.getMonth()}}-{{info.start.getFullYear()}} по {{info.end.getDate()}}-{{info.end.getMonth()}}-{{info.end.getFullYear()}}]</span>    </div>        <div class="row-line">      <span class="head">Двигатель:</span><span><b>{{(info.volume/1000)}}</b> л. {{info.fuel}} <b>{{info.power}}</b> лс/кВт  [{{info.cyl}}/{{info.val}}] цил/клап </span>    </div>        <div class="row-line">      <span class="head">Доп.:</span><span> {{info.drive}} {{info.side}} </span>    </div>        <div class="hsplit"></div>  </div>    <tree ng-model="treeModel" filter="{{typeFilter}}" on-select="groupSelected">       </tree>  </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_car-select-part.html' file -->
<script type="text/ng-template" id="/parts/_car-select-part.html">
<div class="car-select">    <div class="row-line">    <sinput class="car-select-input"             placeholder="Введите производителя или марку автомобиля (3+ символа)"             name="mmodel"             ng-model="filter"             submit="false">                </sinput>  </div>    <tree ng-model="typeSelector" filter="{{filter}}" on-select="typeSelected">      </tree>   </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_login-part.html' file -->
<script type="text/ng-template" id="/parts/_login-part.html">
<?php $form = yii\widgets\ActiveForm::begin([        'options' => [          'class' => 'login-form'       ]    ]);?><div class="row-line">  <sinput class="login-input" placeholder="Введите логин или адрес почты" name="login" ng-model="login.name" submit-function="onLogin"></sinput></div><div class="row-line">  <sinput class="login-input" placeholder="Введите пароль" name="password" ng-model="login.password" submit-function="onLogin"></sinput></div><div class="row-line" style="text-align:center;">  <scheckbox name="rememberMe" label="Запомнить меня" ng-model="login.remember"/></div><div class="row-line" style="text-align:center;">  <label ng-click="onLogin()">Войти</label>  <label>Регистрация</label></div>    <?php yii\widgets\ActiveForm::end();?>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_search-dropdown-part.html' file -->
<script type="text/ng-template" id="/parts/_search-dropdown-part.html">
<div class="searh-history">  <span class="header">Прошлые запросы:</span>  <span ng-repeat="hitem in history track by $index" ng-click="onArticulSelect(hitem)">    {{hitem}}  </span></div><ul class="search-helper">  <li class="row-line" ng-repeat="shitem in helper">        <div class="header">Артикул: </div>    <div class="search-articul" ng-click="onArticulSelect(shitem.number)">{{shitem.number}}</div>     <div class="info-item" title="Информация..." ng-click="onDropDownInfo(shitem.aid,shitem.number)"></div>    <div class="header">Производитель:</div>    <div class="search-brand">{{shitem.brand}}</div>  </li></ul>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_settings.html' file -->
<script type="text/ng-template" id="/parts/_settings.html">
<div class="settings">    <div class="row-line analog">        <switch id="show-analog" ng-model="analog.analogShow" class="green"></switch><b> Показывать аналоги</b>    </div>    <div class="divider"></div>  <div class="row-line markup">        <b>Уровень наценки:</b>  </div>  <div class="row-line">        <select ng-model="markup.selected">      <option ng-repeat="item in markup.values track by $index" value="{{item.v}}">{{item.n}} ({{item.v}}%)</option>    </select>  </div>      <div class="divider"></div>  <div class="row-line markup">        <b>Активная корзина</b>  </div>  <div class="row-line">        <select ng-model="basket.selected">      <option ng-repeat="bitem in basket.values" value="{{bitem.id}}"><b>{{bitem.name}}</b></option>    </select>  </div>  </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_sinput.html' file -->
<script type="text/ng-template" id="/parts/_sinput.html">
<div class="sinput">  <input class="sinput"          placeholder="{{placeholder}}"          value="{{value}}"          name="{{name}}"          ng-value="value"          ng-model="model"         type="{{type}}"         max="{{max}}"         min="{{min}}"         step="{{step}}"         />  </div> 
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_tile-selector.html' file -->
<script type="text/ng-template" id="/parts/_tile-selector.html">
<div class="tile-selector">  asd</div>
</script>
 <!-- Collect from 'frontend/views/site/angular//parts/_tree-part.html' file -->
<script type="text/ng-template" id="/parts/_tree-part.html">
<div class="tree-view" >  <ul>      </ul>  </div>
</script>
 <!-- Collect from 'frontend/views/site/angular//search-brands.html' file -->
<script type="text/ng-template" id="/search-brands.html">
<div class="brands-out">  <div class="breadcrumb">    <span>Поиск</span>    <span>{{searchText}}</span>    <span>Производители</span>  </div>  <div ng-if="inSearch" class="in-search"></div>      <div ng-if="!inSearch&&!count" class="count">Вариантов по запросу "<b>{{searchText}}</b>" не найдено</div>  <div ng-if="!inSearch&&count" class="count">Для запроса "<b>{{searchText}}</b>" найдено производителей: <b>{{count}}</b></div>  <div ng-repeat="(brand,data) in brands track by $index" class="brand">    <a href="/parts/{{searchText}}/{{timestamp}}/{{brand}}">{{brand}}</a>  </div></div>
</script>
 <!-- Collect from 'frontend/views/site/angular//search-line.html' file -->
<script type="text/ng-template" id="/search-line.html">
<div class="search-line">  <input type="text" id="search-text" placeholder="Номер детали или её описание" ng-model="text" />  <div class="search-icons">    <ul>      <li><button id="search-sub"><span class="glyphicon glyphicon-download"></span></button></li>      <li><button id="search-cars"><span class="glyphicon cars"></span></button></li>      <li><button id="search-cfg"><span class="glyphicon glyphicon-cog"></span></button></li>      <li><button id="search-request"><span class="glyphicon glyphicon-search"></span></button></li>          </ul>  </div>  </div>
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
