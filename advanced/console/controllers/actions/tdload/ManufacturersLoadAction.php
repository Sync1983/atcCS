<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class ManufacturersLoadAction extends LoadAction{

  public function run(){
    $file = $this->getFileName();
    $sqls = $this->makeCopyRequest("Manufacturers",$file,",",['id','brand','type']);
    $this->executeCommand($sqls);    
  }

}
