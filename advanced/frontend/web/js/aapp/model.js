
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
      {head: "Добро пожаловать", text: "АвтоТехСнаб приветствует Вас", style:"btn-info"}
    ],

    analogShow  : true,      //Отображать аналоги
    isLogin     : false,     //Вход выполнен
    isAdmin     : true,      //Администратор
    accessToken : false      //access-token для запросов
    
    
  };
  
}