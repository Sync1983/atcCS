
/*
 * Модель пользователя системы
 */
function userModel(){
  'use strict';
  
  return {
    name: undefined,
    surname: undefined,
    company: undefined,
    
    markup: [
      { v:15,n:'Простая'},
      { v:10,n:'Сложная'},
      { v:10,n:'Средняя'}
    ],    
    activeMarkup: null,
    
    baskets: [],
    activeBasket: {id:null,name:null,active:false},

    alerts: [
      {head: "Добро пожаловать", text: "Добро пожаловать в нашу мега-супе-пупер-систему", style:"btn-info", new:1},      
      {head: "Ошибка авторизации123445365565656000", text: "Ошибка при авторизации", style:"btn-danger", new:1},      
    ],

    analogShow  : true,      //Отображать аналоги
    isLogin     : false,     //Вход выполнен
    isAdmin     : true,      //Администратор
    accessToken : false      //access-token для запросов
    
    
  };
  
}