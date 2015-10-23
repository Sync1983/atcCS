<?php

use yii\db\Schema;
use yii\db\Migration;

class m151021_120201_tbl_types extends Migration{

 public function up(){
   $this->createTable('Types', [            
                  'id'                  => 'BIGSERIAL PRIMARY KEY',

                  'type_id'             => 'INTEGER',
                  'model_id'            => 'INTEGER',
                  'kw'                  => 'INTEGER',
                  'hp'                  => 'INTEGER',
                  'volume'              => 'INTEGER',
                  'cylinder'            => 'INTEGER',
                  'valves'              => 'INTEGER',

                  'text_id'             => 'INTEGER',
                  'fuel_id'             => 'INTEGER',
                  'drive_id'            => 'INTEGER',
                  'side_id'             => 'INTEGER',
                  
                  'start'               => 'DATE',
                  'end'                 => 'DATE',
                  
   ]);

   $this->createIndex('tp_by_model', 'Types','model_id');
   $this->createIndex('tp_by_text',  'Types','text_id');

 }

 public function down() {
     return $this->dropTable('Types');
 }
}
