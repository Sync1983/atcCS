<?php

use yii\db\Schema;
use yii\db\Migration;

class m151106_090729_tbl_users extends Migration {

 public function up(){
   return $this->createTable('Users', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'user_name'           => 'varchar(100) NOT NULL',
                  'user_pass'           => 'varchar(62) NOT NULL',
                  'role'                => 'smallint default 0',      //Роль пользователя
                  'over_price'          => 'smallint',                //Наценка для пользователя                  
                  'credit'              => 'integer',                 //Кредит пользователя
                  'is_init'             => 'smallint default 0',      //Проведены ли начальные настройки

                  /*'first_name'          => 'varchar(50)',             //Имя
                  'second_name'         => 'varchar(50)',             //Фамилия
                  'type'                => 'smallint',                //Тип
                  'name'                => 'varchar(150)',            //Название фирмы
                  'inn'                 => 'varchar(20)',             //ИНН фирмы
                  'kpp'                 => 'varchar(20)',             //КПП фирмы
                  'addres'              => 'text',                    //Адрес доставки
                  'phone'               => 'text',                    //Телефон для связи
                  'email'               => 'varchar(150)',            //Почта для связи*/
   ]);
 }

 public function down() {
     return $this->dropTable('Users');
 }
}
