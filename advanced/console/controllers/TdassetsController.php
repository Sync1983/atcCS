<?php

/**
 * @author sync1983
 */

namespace console\controllers;
use yii\console\Controller;
use mysqli;
use common\models\MongoArticle;

class TdassetsController extends Controller{
  /* @var $db mysqli */
  public $db = null;
  /* @var $redis \yii\redis\Connection */
  public $redis = null;
  public $dir = "backend/text-data/";


  public function init() {
    parent::init();
    $this->db = new \mysqli('localhost', 'root', 'test', 'techdock');
    $this->redis = \yii::$app->get('redis');

    if( $this->db->errno ){
      die("Mysql connect error: " . $this->db->error);
    }

    $this->db->set_charset("utf8");
    
  }

  public function actionSup(){
    /* @var $result \mysqli_result */
    $result = $this->db->query("SELECT * FROM suppliers");
    if( !$result ){
      die($this->db->error);
    }
    $file = fopen($this->dir . "sup.csv", "w");
    while($row = $result->fetch_array()){
      $line = $row['SUP_ID'] . "," . $row['SUP_BRAND'] . "\n";      
      fputs($file, $line, strlen($line));      
    }
    fclose($file);
    echo "Ok\r\n";
  }

  public function actionDes(){
    /* @var $result \mysqli_result */
    $result = $this->db->query( "SELECT des_id, tex_text FROM designations" .
                                " inner join des_texts on des_texts.TEX_ID = DES_TEX_ID".
                                " where DES_LNG_ID=4;");
    if( !$result ){
      die($this->db->error);
    }
    $file = fopen($this->dir . "des_en.csv", "w");
    while($row = $result->fetch_array()){
      $line = $row['des_id'] . "," . $row['tex_text'] . "\n";
      fputs($file, $line, strlen($line));
    }
    fclose($file);
    echo "Eng Ok\r\n";

    $result = $this->db->query( "SELECT des_id, tex_text FROM designations" .
                                " inner join des_texts on des_texts.TEX_ID = DES_TEX_ID".
                                " where DES_LNG_ID=16;");
    if( !$result ){
      die($this->db->error);
    }
    $file = fopen($this->dir . "des_ru.csv", "w");
    while($row = $result->fetch_array()){
      $line = $row['des_id'] . "," . $row['tex_text'] . "\n";
      fputs($file, $line, strlen($line));
    }
    fclose($file);
    echo "Rus Ok\r\n";
  }

  public function actionArticles(){
    /* @var $result \mysqli_result */
    $result = $this->db->query("SELECT ART_ID, ART_ARTICLE_NR, ART_SUP_ID, ART_COMPLETE_DES_ID FROM articles");
    if( !$result ){
      die($this->db->error);
    }
    $file = fopen($this->dir . "articles.csv", "w");
    //$head = "Art_id,Article,Sup,Descr";
    //fputs($file, $head, strlen($head));
    while($row = $result->fetch_array()){
      $line = strtoupper($row['ART_ID']) . "," . strtoupper($row['ART_ARTICLE_NR']) . "," . $row['ART_SUP_ID'] . "," . $row['ART_COMPLETE_DES_ID'] . ", \n";
      fputs($file, $line, strlen($line));
    }
    fclose($file);
    echo "Ok\r\n";
  }

  public function actionPushSupliesToRedis(){
    /* @var $this->redis \yii\redis\Connection */
    $file = fopen($this->dir . "sup.csv", "r");

    while( !feof($file) ){

      $line = fgets($file);
      $parts = explode(",", $line);
      if ( !isset($parts[0]) || !isset($parts[1])){
        continue;
      }

      $this->redis->executeCommand("SET",["SUP-".$parts[0],$parts[1]]);
      
    }

    fclose($file);
    echo "Ok\r\n";
  }

  public function actionPushDescToRedis(){
    /* @var $this->redis \yii\redis\Connection */
    $file = fopen($this->dir . "des_ru.csv", "r");

    while( !feof($file) ){

      $line = fgets($file);
      $parts = explode(",", $line);
      if ( !isset($parts[0]) || !isset($parts[1])){
        continue;
      }

      $this->redis->executeCommand("SET",["DES-RU-".$parts[0],$parts[1]]);

    }

    fclose($file);
    echo "Ok RU\r\n";

    $file = fopen($this->dir . "des_en.csv", "r");

    while( !feof($file) ){

      $line = fgets($file);
      $parts = explode(",", $line);
      if ( !isset($parts[0]) || !isset($parts[1])){
        continue;
      }

      $this->redis->executeCommand("SET",["DES-EN-".$parts[0],$parts[1]]);

    }

    fclose($file);
    echo "Ok EN\r\n";
  }

  public function actionPushArticlesToRedis(){
    $file = fopen($this->dir . "articles.csv", "r");

    while( !feof($file) ){
      $line = fgets($file);
      $parts = explode(",", $line);
      if( !isset($parts[0]) || !isset($parts[1]) || !isset($parts[2]) || !isset($parts[3]) ){
        continue;
      }
      $parts[1] = strtoupper($parts[1]);

      $data = [
        'id'  => $parts[0],
        'article' => $parts[1],
        'supply'  => $this->redis->executeCommand('GET',["SUP-".strval($parts[2])]),
        'descrRU' => $this->redis->executeCommand('GET',["DES-RU-".strval($parts[3])]),
        'descrEN' => $this->redis->executeCommand('GET',["DES-EN-".strval($parts[3])]),
      ];

      $stdArticle = preg_replace("/[\s\.\-]/", "", $parts[1]);

      $item = new \common\models\RedisArticle();
      $item->setAttributes($data, false);
      $item->save(false);

      if( $stdArticle !== $parts[1] ){
        
        $data['article'] = $stdArticle;
        
        $item = new \common\models\RedisArticle();
        $item->setAttributes($data, false);
        $item->save(false);

      }
      
    }

    fclose($file);
    echo "Ok\r\n";
  }

  public function actionPushToRedis(){
    $this->actionPushDescToRedis();
    $this->actionPushSupliesToRedis();
    $this->actionPushArticlesToRedis();
  }

  protected function getArticulDataByLimit($start,$limit){
    /* @var $result \mysqli_result */
    $SQL = <<<SQL
      SELECT 	
        ARL_ART_ID              as ID,
        ARL_SEARCH_NUMBER 			as part_search_number,
        convert(ARL_KIND,char)	as part_type,
        ARL_DISPLAY_NR          as part_full_number,
        ARL_BRA_ID              as brand
      FROM art_lookup
      LIMIT $start,$limit;
SQL;

    $result = $this->db->query($SQL);
    if( !$result){
      echo "Mysql error!\r\n";
      return false;
    }
    
    
    while ( $row = $result->fetch_array(MYSQLI_ASSOC) ){
      $record = new MongoArticle();
      $record->setAttributes($row);
      $record->save();
    }
    $result->close();
    
    return true;
  }

  public function actionMysqlToMongo(){
    /* @var $result \mysqli_result */
    $result = $this->db->query("SELECT count(*) as art_cnt FROM techdock.art_lookup;");
    if( !$result){
      echo "Mysql error!\r\n";
      return;
    }
    $row = $result->fetch_array(MYSQLI_ASSOC);
    if( !isset($row['art_cnt']) ){
      echo "Mysql answer error!\r\n";
      return;
    }
    $count = $row['art_cnt'] * 1;
    $result->close();
    echo "Articles count: $count \r\n";
    $start_cnt = 0;
    $limit = 10000;
    $one_percent = round($count/100);
    
    echo "\r\n";
    $time = time();
    while($start_cnt <= $count ){      
      $this->getArticulDataByLimit($start_cnt,$limit);

      $d_time = time() - $time;
      $time   = time();
      $percents = round($start_cnt/$one_percent);
      $percent_string = str_pad("", $percents, "=");
      $percent_string = str_pad($percent_string, 100, ".");
      echo sprintf("start: %'.10u stop: %'.10u  last time: %'.5u sec.\r\n",$start_cnt,$start_cnt + $limit,$d_time);
      echo sprintf("[%'002u%%] [%s]",$percents, $percent_string);
      echo "\033[1A";
      echo "\033[0G";
      $start_cnt += $limit;
    }

  }

}
