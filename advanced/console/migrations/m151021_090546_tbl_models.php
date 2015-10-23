<?php

use yii\db\Schema;
use yii\db\Migration;

class m151021_090546_tbl_models extends Migration{

 public function up(){
   $this->createTable('Models', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'model_id'            => 'BIGSERIAL',
                  'manufacturers_id'    => 'BIGSERIAL',
                  'start'               => 'DATE',
                  'end'                 => 'DATE',
                  'type'                => 'BIT(3) DEFAULT B\'000\'',
                  'text_id'             => 'INTEGER',
   ]);

   $this->createIndex('m_by_type','Models','type');
   $this->createIndex('m_by_text','Models','text_id');
   $this->createIndex('m_by_model','Models','model_id');
   $this->createIndex('m_by_mnf','Models','manufacturers_id');

 }

 public function down() {
     return $this->dropTable('Models');
 }

}
