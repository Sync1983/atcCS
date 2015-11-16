<?php

use yii\db\Schema;
use yii\db\Migration;

class m151116_075705_tbl_mfc_models extends Migration{

  public function up(){    
    $SQL =  'CREATE TABLE "MFC-Models" AS ('
          . '  SELECT '
          . '           mfc.id as mfc_id,'
          . '           md.model_id as model,'
          . '           mfc.brand as mfc_txt,'
          . '           txt.text as model_txt'
          . '  FROM "Models" as md'
          . '  INNER JOIN "Manufacturers" as mfc ON mfc.id = md.manufacturers_id'
          . '  INNER JOIN "Texts" as txt ON txt.id = md.text_id'
          . '  ORDER BY md.manufacturers_id'
          . ');';

   $this->db->createCommand($SQL)->execute();
  }

  public function down() {
    return $this->dropTable('MFC-Models');
  }

}
