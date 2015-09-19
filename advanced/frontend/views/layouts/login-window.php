<?php ?>
<modal class="login-window" title="Вход" ng-model="loginShow">
  <form role="form">
    <div class="form-group">
      <label for="login">Логин</label>
      <input type="text" class="form-control" placeholder="Введите Ваш логин" ng-model="login.name" ng-required />      
    </div>
    <div class="form-group">
      <label for="password">Пароль</label>
      <input type="password" class="form-control" id="password" placeholder="Пароль" ng-model="login.password" ng-required />
    </div>
    <div class="form-group">
      <checkbox ng-model="login.remember" class="">&nbsp;Запомнить меня</checkbox>
    </div>
    <button class="btn btn-info" ng-click="onLogin();">Войти</button>
  </form>
</modal>