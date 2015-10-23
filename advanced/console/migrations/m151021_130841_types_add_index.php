<?php

use yii\db\Schema;
use yii\db\Migration;

class m151021_130841_types_add_index extends Migration {

    public function up() {
      $this->createIndex('tp_by_type', 'Types','type_id');
    }

    public function down() {
      $this->dropIndex('tp_by_type','Types');
    }
    
}
