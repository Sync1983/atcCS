<?php

use yii\db\Migration;

class m161107_123502_add_photo_url_to_catalog extends Migration{

 public function up(){
   $this->addColumn('Catalog', 'photo_url', 'VARCHAR(250)');
 }

 public function down() {
     return true;
 }
}