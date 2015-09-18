'use strict';

/*
 * Модель пользователя системы
 */
function userModel(){
  
  return {
    name: 'Йожыг',
    surname: 'Йожыгов',
    company: 'ООО Йожыная ферма',
    
    markup: [
      { v:15,n:'Простая'},
      { v:10,n:'Сложная'}
    ],

    analogShow: false,

    login: false,
    
  };
  
}