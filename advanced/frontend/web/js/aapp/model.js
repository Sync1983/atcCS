
/*
 * Модель пользователя системы
 */
function userModel(){
  'use strict';
  
  return {
    name: 'Йожыг',
    surname: 'Йожыгов',
    company: 'ООО Йожыная ферма',
    
    markup: [
      { v:15,n:'Простая'},
      { v:10,n:'Сложная'},
      { v:10,n:'Средняя'}
    ],

    alerts: [
      {head: "Добро пожаловать", text: "Добро пожаловать в нашу мега-супе-пупер-систему", style:"btn-info", new:1},
      {head: "Добро пожаловать", text: "Добро пожаловать в нашу мега-супе-пупер-систему", style:"btn-info", new:1},
      {head: "Добро пожаловать", text: "Добро пожаловать в нашу мега-супе-пупер-систему", style:"btn-info", new:1},
      {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1},
      {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1},
      {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1},
      {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1},
    ],

    analogShow  : true,      //Отображать аналоги
    isLogin     : false,     //Вход выполнен
    isAdmin     : true,      //Администратор
    accessToken : false      //access-token для запросов
    
    
  };
  
}