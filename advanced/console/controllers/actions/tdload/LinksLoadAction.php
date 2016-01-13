<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class LinksLoadAction extends LoadAction{

  public function run(){
    $db   = \yii::$app->getDb();
    $db->createCommand("CREATE TABLE IF NOT EXISTS \"LinksLoad\" ( type_id bigserial, group_id bigserial, supplier_id bigserial, la_id bigserial ) ;")->execute();


    $action = $this->id;
    $path   = \yii::getAlias("@load_data_dir");
    $file_name = $path . "/tbl_" . str_replace("Load", "", $action) ."-p*";
    $files  = glob($file_name);

    $sqls   = [];
    $sqls['clean'] = $this->getCleanCommand("LinksLoad");
    $ignore_names = [
            /*'tbl_links-paa',
            'tbl_links-pab',
            'tbl_links-pac',
            'tbl_links-pad',
            'tbl_links-pae',
            'tbl_links-paf',
            'tbl_links-pag',
            'tbl_links-pah',
            'tbl_links-pai',
            'tbl_links-paj',
            'tbl_links-pak',
            'tbl_links-pal',
            'tbl_links-pam',
            'tbl_links-pan',
            'tbl_links-pao',
            'tbl_links-pap',
            'tbl_links-paq',*/
    ];

    foreach ($files as $file){
      $name = basename($file);
      if( in_array($name, $ignore_names) ){
        continue;
      }
      $sqls["load: $name"] = $this->getCopyCommand("LinksLoad", $file, ",", ['type_id','group_id','supplier_id','la_id'],false);
    }

    $this->executeCommand($sqls);
    
  }

}
