<?php

use yii\db\Schema;
use yii\db\Migration;

class m160303_065844_add_part_status_list extends Migration{

  public function up(){
    $this->createTable("StatusText", [
              'id'  => 'INTEGER PRIMARY KEY',
              'txt' => 'VARCHAR(20)'
            ]);

    $this->insert("StatusText", ['id'=>0,'txt'=>'В обработке']);
    $this->insert("StatusText", ['id'=>1,'txt'=>'Ожидает заказа']);
    $this->insert("StatusText", ['id'=>2,'txt'=>'В работе']);
    $this->insert("StatusText", ['id'=>3,'txt'=>'Заказано']);
    $this->insert("StatusText", ['id'=>4,'txt'=>'На складе']);
    $this->insert("StatusText", ['id'=>5,'txt'=>'В пути']);
    $this->insert("StatusText", ['id'=>6,'txt'=>'Выдано']);
    $this->insert("StatusText", ['id'=>7,'txt'=>'Отказ']);

    $this->addForeignKey("status_id_control", "Status", 'status', "StatusText", 'id', 'RESTRICT', 'CASCADE');
  }

  public function down() {
    return $this->dropTable("StatusText");
  }
}
