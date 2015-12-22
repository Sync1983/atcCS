<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class ArticleInfoLoadAction extends LoadAction{

  public function run(){
    $file = $this->getFileName();
    $sqls = $this->makeCopyRequest("ArticleInfo",$file,",",['id','number','supplier','description','type']);
    $this->executeCommand($sqls);    
  }

}
