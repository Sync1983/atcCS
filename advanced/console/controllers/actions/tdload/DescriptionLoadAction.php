<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class DescriptionLoadAction extends LoadAction{

  public function run(){
    $file = $this->getFileName();
    $sqls = $this->makeCopyRequest("Description",$file,"E'\\t'",['"id"','"desc"']);            
    $this->executeCommand($sqls);
  }

}
