<?php

/**
 * @author sync1983
 */

namespace console\controllers;
use yii\console\Controller;
use mysqli;

class TdassetsController extends Controller{
  /* @var $db mysqli */
  public $db = null;
  public $dir = "backend/text-data/";


  public function init() {
    parent::init();
    $this->db = new \mysqli('localhost', 'root', 'test', 'techdock');
    
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
    $result = $this->db->query("SELECT ART_ARTICLE_NR, ART_SUP_ID, ART_COMPLETE_DES_ID FROM articles");
    if( !$result ){
      die($this->db->error);
    }
    $file = fopen($this->dir . "articles.csv", "w");
    $head = "Article,Sup,Descr";
    fputs($file, $head, strlen($head));
    while($row = $result->fetch_array()){
      $line = $row['ART_ARTICLE_NR'] . "," . $row['ART_SUP_ID'] . "," . $row['ART_COMPLETE_DES_ID'] . "\n";
      fputs($file, $line, strlen($line));
    }
    fclose($file);
    echo "Ok\r\n";
  }
}
