<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class LinksArtLoadAction extends LoadAction{

  public function run(){
    /* @var $db \yii\db\Connection */
    $db   = \yii::$app->getDb();
    $db->createCommand("CREATE TABLE IF NOT EXISTS \"LinkArt\" ( la_id bigserial, la_art_id bigserial ) ;")->execute();
    $file = $this->getFileName();
    $sqls = $this->makeCopyRequest("LinkArt",$file,",",['la_id','la_art_id']);
    $this->executeCommand($sqls);    
  }

}
