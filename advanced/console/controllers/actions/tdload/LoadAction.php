<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use yii\base\Action;

class LoadAction extends Action{

  protected function getCopyCommand($table_name, $file_name, $separator, $fields, $header=true, $encode='UTF-8'){
    $table_fields = "";
    if( is_string($fields) ){
      $table_fields = "(" . $fields . ")";
    } elseif( is_array($fields) ){
      $table_fields = "(" . implode(",", $fields) . ")";
    }

    if( substr($separator,0,1) !== 'E' ){
      $separator = "'" . $separator . "'";
    }
    $header_str = "HEADER";
    if( !$header ){
      $header_str = "";
    }

    return "COPY \"$table_name\" $table_fields FROM '$file_name' CSV DELIMITER $separator $header_str ENCODING '$encode'";
  }

  protected function getCleanCommand($table_name){
    /* @var $db \yii\db\Connection */
    $db = \yii::$app->getDb();
    $params = null;
    return $db->queryBuilder->delete($table_name,'',$params);
  }

  protected function makeCopyRequest($table_name, $file_name, $separator, $fields){    
    $sql_clean = $this->getCleanCommand($table_name);
    $sql_copy = $this->getCopyCommand($table_name, $file_name, $separator, $fields);

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
      Echo "$key: start\r\n";
      $result = $db->createCommand($command)->execute();
      Echo "$key: " . ($result?"Ok [$result]":"Fail") . "\r\n";
    }
  }

}
