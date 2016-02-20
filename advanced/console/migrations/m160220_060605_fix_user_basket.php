<?php

use yii\db\Schema;
use yii\db\Migration;

class m160220_060605_fix_user_basket extends Migration{

 public function up(){   
   $this->alterColumn('UserBasket', 'basket_id' , 'INTEGER');
   $this->addColumn('UserBasket', 'name'      , 'VARCHAR(100)');
   $this->addColumn('UserBasket', 'active'      , 'BOOLEAN');
   $this->addPrimaryKey('basket_id_pk', 'UserBasket', 'basket_id');
 }

 public function down() {
     return true;
 }
}
