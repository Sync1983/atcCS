
/*
 * Модель пользователя системы
 */
function userModel(){
  'use strict';
  
  return {
    name: undefined,
    surname: undefined,
    company: undefined,
    
    markup: [],    
    activeMarkup: null,
    activeMarkupName: null,
    
    baskets: [],
    activeBasket: {id:null,name:null,active:false},

    alerts: [
      {head: "Добро пожаловать", text: "АвтоТехСнаб приветствует Вас", style:"btn-info"}
    ],

    analogShow  : true,      //Отображать аналоги
    isLogin     : false,     //Вход выполнен
    isAdmin     : false,     //Администратор
    accessToken : false      //access-token для запросов 
    
    
  };
  
}