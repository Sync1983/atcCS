<?php

use yii\db\Schema;
use yii\db\Migration;

class m151022_112247_dummy_migrate_for_protection extends Migration
{
    public function up() {
      echo "  Пустая миграция! Защищает базу данных от отката. \r\nПри откате миграции подумайте, нужно ли вам это\r\n";
      return true;
    }

    public function down() {
      echo "  Пустая миграция! Защищает базу данных от отката. \r\nПри откате миграции подумайте, нужно ли вам это\r\n";
      $answer = readline("Продолжить? (yes\\no)");
      if( ($answer == "y") || ($answer == "yes") ){
        return true;
      }
      return false;
    }
    
}
