<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class GenArtLoadAction extends LoadAction{

  public function run(){
    $file = $this->getFileName();
    $sqls = $this->makeCopyRequest("GroupInfo",$file,",",['id','des_id','std_id','asm_id','itd_id']);
    $this->executeCommand($sqls);    
  }

}
