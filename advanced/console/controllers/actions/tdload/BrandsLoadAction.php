<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class BrandsLoadAction extends LoadAction{

  public function run(){
    $file = $this->getFileName();
    $sqls = $this->makeCopyRequest("Supplier",$file,",",['id','brand']);
    $this->executeCommand($sqls);    
  }

}
