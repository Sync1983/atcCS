<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class TextsLoadAction extends LoadAction{

  public function run(){
    $file = $this->getFileName();
    $sqls = $this->makeCopyRequest("Texts",$file,"@",['id','text']);
    $this->executeCommand($sqls);    
  }

}
