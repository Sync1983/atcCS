<?php

use yii\db\Schema;
use yii\db\Migration;

class m151106_091758_create_admin_user extends Migration {

  public function up(){
    $user = new common\models\User();
    $user->user_name = "admin";
    $user->setPassword("test");
    $user->over_price = 0;
    $user->role       = common\models\User::IS_ADMIN;
    $user->is_init    = 0;
    $user->credit     = 10000;
    if( !$user->save() ){
      print_r($user->getErrors());
      return false;
    }
    return true;
  }

  public function down() {
    /* @var $user common\models\User */
    $user = \common\models\User::findByUsername('admin');
    if( $user ){
      return $user->delete();
    }
    return false;
  }

}
