<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class StrLookupLoadAction extends LoadAction{

  public function run(){
    $file = $this->getFileName();
    $sqls = $this->makeCopyRequest("StrLookup",$file,",",['ga_id','str_id']);
    $this->executeCommand($sqls);    
  }

}
