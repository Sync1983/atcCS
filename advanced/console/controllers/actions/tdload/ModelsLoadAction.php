<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class ModelsLoadAction extends LoadAction{

  public function run(){
    $file = $this->getFileName();
    $sqls = $this->makeCopyRequest("Models",$file,",",['model_id','manufacturers_id','start','"end"','type','text_id']);
    $this->executeCommand($sqls);    
  }

}
