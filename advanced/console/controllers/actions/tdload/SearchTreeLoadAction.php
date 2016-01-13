<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class SearchTreeLoadAction extends LoadAction{

  public function run(){
    $file = $this->getFileName();
    $sqls = $this->makeCopyRequest("SearchTree",$file,",",['type','des_id','path']);
    $this->executeCommand($sqls);    
  }

}
