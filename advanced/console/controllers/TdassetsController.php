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
    /*$this->db = new \mysqli('localhost', 'root', 'test', 'techdock');
    $this->redis = \yii::$app->get('redis');

    if( $this->db->errno ){
      die("Mysql connect error: " . $this->db->error);
    }

    $this->db->set_charset("utf8");*/
    
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

  public function actionManufacturersToPg(){
    /* @var $result \mysqli_result */
    $SQL = "SELECT
              MFA_ID as id,
              MFA_BRAND as brand,
              CONCAT('\'',MFA_PC_MFC,MFA_CV_MFC,MFA_ENG_MFC,MFA_AXL_MFC,'\'') as `type`
            FROM manufacturers order by MFA_ID;";
    $result = $this->db->query($SQL);
    if( !$result ){
      die($this->db->error);
    }
    while($row = $result->fetch_array(MYSQL_ASSOC)){

      $mfa= new \common\models\PgManufacturers();
      $mfa->setAttributes($row);
      $mfa->save();

    }
    $result->close();
  }

  public function actionModelsToPg(){
    /* @var $result \mysqli_result */
    $SQL = "SELECT
              MOD_ID as model_id,
              MOD_MFA_ID as manufacturers_id,
              MOD_PCON_START as `start`,
              MOD_PCON_END as `end`,
              concat(MOD_PC,MOD_CV,MOD_AXL) as `type`,
              CDS_TEX_ID as `text_id`
            FROM techdock.models as md
            LEFT JOIN techdock.country_designations as cd ON CDS_ID = md.MOD_CDS_ID and CDS_LNG_ID=16;";
    $result = $this->db->query($SQL);
    if( !$result ){
      die($this->db->error);
    }
    while($row = $result->fetch_array(MYSQL_ASSOC)){

      $model= new \common\models\PgModels();
      $start = $row['start'];
      if( !$start ){
        $start = "197001";
      }
      $start_year = substr($start, 0,4);
      $start_month= substr($start, 4,2);
      $row['start'] = "01-$start_month-$start_year";
      
      $end = $row['end'];
      $end_year = substr($end, 0,4);
      $end_month= substr($end, 4,2);
      $end_month_start = "01-$end_month-$end_year";
      if( !$end ){
        $end_month_start = date_format(new \DateTime(), "01-m-Y");
      }
      $end_date = new \DateTime($end_month_start);      
      $row['end'] = $end_date->format("t-m-Y");      
      $model->setAttributes($row);
      if( !$model->save() ) {
        throw new \Exception(implode("\r\n",$model->getFirstErrors()));
      };

    }
    $result->close();
  }

  public function actionTypesToPg(){
    /* @var $result \mysqli_result */
    $des = [];
    $sql="select des_id,des_tex_id from designations where des_lng_id=16";
    $result = $this->db->query($sql);
    if( !$result ){
      die($this->db->error);
    }
    while($row = $result->fetch_array(MYSQL_ASSOC)){
      $des[$row['des_id']] = $row['des_tex_id'];
    }
    $result->close();
    echo " Designators load\r\n";
    $SQL = "SELECT
              TYP_ID as type_id,
              TYP_MOD_ID as model_id,
              cd.CDS_TEX_ID as 'text_id',
              TYP_PCON_START as 'start',
              TYP_PCON_END as 'end',
              TYP_KW_FROM as 'kw',
              TYP_HP_FROM as 'hp',
              TYP_CCM	as 'volume',
              TYP_CYLINDERS as 'cylinder',
              TYP_VALVES as 'valves',
              TYP_KV_FUEL_DES_ID as 'fuel',
              TYP_KV_DRIVE_DES_ID as 'drive',
              TYP_KV_STEERING_SIDE_DES_ID as 'side'
            FROM techdock.types as tp
            INNER JOIN techdock.country_designations as cd ON cd.CDS_ID = TYP_MMT_CDS_ID and cd.CDS_LNG_ID=16";
    $result = $this->db->query($SQL);
    if( !$result ){
      die($this->db->error);
    }
    while($row = $result->fetch_array(MYSQL_ASSOC)){

      $model= new \common\models\PgTypes();
      $start = $row['start'];
      if( !$start ){
        $start = "197001";
      }
      $start_year = substr($start, 0,4);
      $start_month= substr($start, 4,2);
      $row['start'] = "01-$start_month-$start_year";

      $end = $row['end'];
      $end_year = substr($end, 0,4);
      $end_month= substr($end, 4,2);
      $end_month_start = "01-$end_month-$end_year";
      if( !$end ){
        $end_month_start = date_format(new \DateTime(), "01-m-Y");
      }
      $end_date = new \DateTime($end_month_start);
      $row['end'] = $end_date->format("t-m-Y");

      $row['fuel_id']  = \yii\helpers\ArrayHelper::getValue($des, $row['fuel'], 0);
      $row['drive_id'] = \yii\helpers\ArrayHelper::getValue($des, $row['drive'], 0);
      $row['side_id']  = \yii\helpers\ArrayHelper::getValue($des, $row['side'], 0);
      
      unset($row['fuel']);
      unset($row['drive']);
      unset($row['side']);

      $model->setAttributes($row);
      if( !$model->save() ) {
        throw new \Exception(implode("\r\n",$model->getFirstErrors()));
      };

    }
    $result->close();
  }

  public function actionTextsToPg(){
    /* @var $result \mysqli_result */
    $SQL = "SELECT
              TEX_ID as id,
              TEX_TEXT as `text`
            FROM des_texts";
    $result = $this->db->query($SQL);
    if( !$result ){
      die($this->db->error);
    }
    while($row = $result->fetch_array(MYSQL_ASSOC)){

      $text = new \common\models\PgTexts();
      $text->setAttributes($row);
      if( !$text->save() ) {
        throw new \Exception(implode("\r\n",$model->getFirstErrors()));
      };

    }
    $result->close();
  }

  public function actionGAToPg(){
    /* @var $result \mysqli_result */
    $result = $this->db->query("SELECT * FROM tof_generic_articles");
    if( !$result ){
      die($this->db->error);
    }
    while($row = $result->fetch_array(MYSQL_ASSOC)){

      $sup = new \common\models\PgGroupInfo();
      foreach ($row as $key=>$value){
        if( !$value ){
          $row[$key] = 0;
        }
      }
      $sup->setAttribute('id',$row['GA_ID']);
      $sup->setAttribute('des_id',$row['GA_DES_ID']);
      $sup->setAttribute('std_id',$row['GA_DES_ID_STANDARD']);
      $sup->setAttribute('asm_id',$row['GA_DES_ID_ASSEMBLY']);
      $sup->setAttribute('itd_id',$row['GA_DES_ID_ASSEMBLY']);
      
      $sup->save();

    }
    $result->close();
  }
  

}
