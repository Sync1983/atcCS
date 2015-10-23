<?php

use yii\db\Schema;
use yii\db\Migration;

class m151022_081725_tbl_links_index extends Migration {

    public function up() {
      $this->createIndex('ln_by_type',   'Links','type_id');
      $this->createIndex('ln_by_group',  'Links','group_id');
      $this->createIndex('ln_by_sup',    'Links','supplier_id');
      $this->createIndex('ln_by_articul','Links','articul_id');
    }

    public function down() {
      $this->dropIndex('ln_by_type',   'Links');
      $this->dropIndex('ln_by_group',  'Links');
      $this->dropIndex('ln_by_sup',    'Links');
      $this->dropIndex('ln_by_articul','Links');
    }

}
