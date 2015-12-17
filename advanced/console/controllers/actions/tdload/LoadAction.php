<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use yii\base\Action;

class LoadAction extends Action{

  protected function makeCopyRequest($table_name, $file_name, $separator, $fields){
    /* @var $db \yii\db\Connection */
    $db = \yii::$app->getDb();
    
    $params = null;
    $sql_clean = $db->queryBuilder->delete($table_name,'',$params);
    
    $table_fields = "";
    if( is_string($fields) ){
      $table_fields = "(" . $fields . ")";
    } elseif( is_array($fields) ){
      $table_fields = "(" . implode(",", $fields) . ")";
    }

    if( substr($separator,0,1) !== 'E' ){
      $separator = "'" . $separator . "'";
    }

    $sql_copy = "COPY \"$table_name\" $table_fields FROM '$file_name' CSV DELIMITER $separator HEADER ENCODING 'UTF-8'";

    return [
            'clean' => $sql_clean,
            'copy'  => $sql_copy
    ];
  }

  protected function getFileName(){
    $action = $this->id;
    $path   = \yii::getAlias("@load_data_dir");
    $file_name = $path . "/tbl_" . str_replace("Load", "", $action) .".csv";
    return $file_name;
  }

  protected function executeCommand($commands){
    /* @var $db \yii\db\Connection */
    $db   = \yii::$app->getDb();
    foreach ($commands as $key => $command){
      $result = $db->createCommand($command)->execute();
      Echo "$key: " . ($result?"Ok [$result]":"Fail") . "\r\n";
    }
  }

}
