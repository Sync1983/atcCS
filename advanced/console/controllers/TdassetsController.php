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
  /* @var $db \yii\db\pgsql */
  public $pb = null;
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

  protected function getArticulDataByLimit($start,$limit){
    /* @var $result \mysqli_result */
    $SQL = <<<SQL
      SELECT 	
        ARL_ART_ID              as part_id,
        ARL_SEARCH_NUMBER 			as part_search_number,
        convert(ARL_KIND,char)	as part_type,
        ARL_DISPLAY_NR          as part_full_number,
        ARL_BRA_ID              as brand
      FROM art_lookup
SQL;
//      LIMIT $start,$limit;

    $result = $this->db->query($SQL);
    if( !$result){
      echo "Mysql error!\r\n";
      return false;
    }

    echo "Memory: ". memory_get_usage() . "\r\n";
    $fp = fopen("/home/sync1983/db.csv", "w");
    $cnt = 1;
    while ( $row = $result->fetch_array(MYSQLI_ASSOC) ){
      $str = $cnt++;
      foreach ($row as $value){
        $str .= "\t\"" . trim($value) .'"';
      }
      $str .= "\n";
      fwrite($fp, $str);
    }
    $result->close();
    fclose($fp);
    
    return true;
  }

  
  public function actionArticlesToPg(){
    /* @var $result \mysqli_result */
    
    $count = 55120915;
    
    echo "Articles count: $count \r\n";

    $start_cnt = 0;
    $limit = 100000;

    $one_percent = round($count/100);

    echo "\r\n";
    $time = time();

      $this->getArticulDataByLimit($start_cnt,$limit);
    /*while($start_cnt <= $count ){

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
    }*/

  }

  public function actionSuppliersToPg(){
    /* @var $result \mysqli_result */
    $result = $this->db->query("SELECT SUP_ID as id, SUP_BRAND as brand FROM suppliers");
    if( !$result ){
      die($this->db->error);
    }
    while($row = $result->fetch_array(MYSQL_ASSOC)){
      
      $sup = new \common\models\PgSuppliers();
      $sup->setAttributes($row);
      $sup->save();
      
    }
    $result->close();
  }

  public function actionBrandsToPg(){
    /* @var $result \mysqli_result */
    $result = $this->db->query("SELECT BRA_ID as id, BRA_BRAND as brand FROM brands");
    if( !$result ){
      die($this->db->error);
    }
    while($row = $result->fetch_array(MYSQL_ASSOC)){

      $bra = new \common\models\PgBrand();
      $bra->setAttributes($row);
      $bra->save();

    }
    $result->close();
  }

  public function actionDescriptionToPg(){
    /* @var $result \mysqli_result */
    $SQL = "SELECT a.DES_ID as id, b.TEX_TEXT as `desc` FROM designations as a Left Join des_texts as b ON a.DES_TEX_ID=b.TEX_ID where DES_LNG_ID=16 ORDER BY a.DES_ID;";
    $result = $this->db->query($SQL);
    if( !$result ){
      die($this->db->error);
    }
    while($row = $result->fetch_array(MYSQL_ASSOC)){

      $bra = new \common\models\PgDescription();
      $bra->setAttributes($row);
      $bra->save();

    }
    $result->close();
  }

  public function actionArticleInfoToPg(){
    /* @var $result \mysqli_result */
    $SQL = "SELECT
              ART_ID as id,
              ART_ARTICLE_NR as `number`,
              ART_SUP_ID as supplier,
              ART_COMPLETE_DES_ID as description,
              CONCAT('\'',ART_PACK_SELFSERVICE,ART_MATERIAL_MARK,ART_REPLACEMENT,ART_ACCESSORY,'\'') as `type`
            FROM articles order by ART_ID;";
    $result = $this->db->query($SQL);
    if( !$result ){
      die($this->db->error);
    }
    while($row = $result->fetch_array(MYSQL_ASSOC)){

      $art = new \common\models\PgArticleInfo();
      $art->setAttributes($row);
      $art->save();

    }
    $result->close();
  }
  

}
