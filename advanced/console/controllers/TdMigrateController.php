<?php

/**
 * @author sync1983
 */

namespace console\controllers;
use yii\console\Controller;

class TdMigrateController extends Controller{
  
  protected function connect(){
    $dsn  = " DSN=TECDOC_CD_1_2015;Database=TECDOC_CD_1_2015;Server=localhost;Port=;UID=tecdoc;PWD=tcd_error_0;Client_CSet=UTF-8;";
    $odbc = odbc_connect($dsn,'','');
    if( !$odbc ){
      echo "Error connect\r\n";
      throw new \yii\base\ErrorException("ODBC Error: " . odbc_errormsg());
    }
    return $odbc;
  }

  protected function openFileToWrite(){
    $path   = \yii::getAlias("@migrate_data_dir");
    $file   = "tbl_" . $this->action->id . ".csv";
    $this->stdout("Open File ");
    $this->stdout($path . "/" . $file, \yii\helpers\Console::FG_GREEN);
    $this->stdout("\r");
    return fopen($path . "/" . $file, "w+");
  }

  public function actionShowTables(){
    $odbc = $this->connect();
    $tables = odbc_tables($odbc);
    while ( odbc_fetch_row($tables) ){
      echo odbc_result($tables, "TABLE_NAME") . "\r\n";
    }
    odbc_close($odbc);
  }

  public function actionArticle(){
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_ART_LOOKUP");
    $str    = 'part_id'             . "," .
              'part_search_number'  . "," .
              'part_type'           . "," .
              'part_full_number'    . "," .
              'brand'               .
             "\r";
    fputs($f, $str, strlen($str));    
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $str = $row['ARL_ART_ID']         . "," .
             $row['ARL_SEARCH_NUMBER']  . "," .
             $row['ARL_KIND']           . "," .
             $row['ARL_DISPLAY_NR']     . "," .
             $row['ARL_BRA_ID']         .
             "\r";
      fputs($f, $str, strlen($str));
      $pos++;
      if( ($pos % 10000) == 0) {
        echo "Save $pos Lines FROM $num\r\n";
      }
    }
    fclose($f);
    odbc_close($odbc);
  }

  public function actionSuppliers(){
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_SUPPLIERS");
    $str    = 'sup_id'  . "," .
              'brand'   .
              "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $str = $row['SUP_ID']   . "," .
             $row['SUP_BRAND'].
             "\r";
      fputs($f, $str, strlen($str));
      $pos++;
      if( ($pos % 100) == 0) {
        echo "Save $pos Lines FROM $num\r\n";
      }
    }
    fclose($f);
    odbc_close($odbc);
  }

  public function actionBrands(){
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_BRANDS");
    $str    = 'bra_id'  . "," .
              'brand'   .
              "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $str = $row['BRA_ID']   . "," .
             $row['BRA_BRAND'].
             "\r";
      fputs($f, $str, strlen($str));
      $pos++;
      if( ($pos % 100) == 0) {
        echo "Save $pos Lines FROM $num\r\n";
      }
    }
    fclose($f);
    odbc_close($odbc);
  }

  public function actionDescription(){
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    odbc_exec($odbc, "SET NAMES 'UTF8'");
    odbc_exec($odbc, "SET client_encoding='UTF-8'");
    $data   = odbc_exec($odbc, "SELECT des.DES_ID as DES_ID, txt.TEX_TEXT as TEXT FROM TOF_DESIGNATIONS des INNER JOIN TOF_DES_TEXTS txt ON txt.TEX_ID = des.DES_TEX_ID where des.DES_LNG_ID=16");
    $str    = 'des_id'  . "\t" .
              'descr'   .
              "\r";
    fputs($f, $str, strlen($str));
    $texts = [];
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $str = $row['DES_ID']   . "\t" .
             $row['TEXT']     .
             "\r";
      $texts[$row['DES_ID']] = $str;      
      $pos++;
      if( ($pos % 10000) == 0) {
        echo "Save $pos Lines\r\n";
      }
    }
    echo "Collect all lang data\r\n";
    $data_255  = odbc_exec($odbc, "SELECT des.DES_ID as DES_ID, txt.TEX_TEXT as TEXT FROM TOF_DESIGNATIONS des INNER JOIN TOF_DES_TEXTS txt ON txt.TEX_ID = des.DES_TEX_ID where des.DES_LNG_ID=255");
    $pos = 0;
    while( $row = odbc_fetch_array($data_255) ){
      $str = $row['DES_ID']   . "\t" .
             $row['TEXT']     .
             "\r";
      if( !isset($texts[$row['DES_ID']]) ){
        $texts[$row['DES_ID']] = $str;
      }      
      $pos++;
      if( ($pos % 10000) == 0) {
        echo "Save $pos Lines FROM\r\n";
      }
    }
    
    ksort($texts);

    foreach ($texts as $text){      
      $text = mb_convert_encoding($text,'UTF-8','windows-1251');
      fputs($f, $text, strlen($text));
    }

    fclose($f);
    odbc_close($odbc);
  }

  public function actionArticleInfo(){
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_ARTICLES");
    $str    = 'art_id'      . "," .
              'number'      . "," .
              'supplier'    . "," .
              'description' . "," .
              'type'        .
             "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $str = $row['ART_ID']             . "," .
             $row['ART_ARTICLE_NR']     . "," .
             $row['ART_SUP_ID']         . "," .
             $row['ART_COMPLETE_DES_ID']. "," .
             "B('" . $row['ART_PACK_SELFSERVICE'] . $row['ART_MATERIAL_MARK'] . $row['ART_REPLACEMENT'] . $row['ART_ACCESSORY'] . "')".
             "\r";
      fputs($f, $str, strlen($str));
      $pos++;
      if( ($pos % 10000) == 0) {
        echo "Save $pos Lines FROM $num\r\n";
      }      
    }
    fclose($f);
    odbc_close($odbc);
  }
  
  public function actionManufacturers(){
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_MANUFACTURERS");
    $str    = 'id'    . "," .
              'brand' . "," .
              'type'  .
              "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $row['MFA_BRAND'] = mb_convert_encoding($row['MFA_BRAND'], 'UTF-8', 'windows-1251');
      $str = $row['MFA_ID']   . "," .
             $row['MFA_BRAND']. "," .
             "B('" . $row['MFA_PC_MFC'] . $row['MFA_CV_MFC'] . $row['MFA_AXL_MFC'] . $row['MFA_ENG_MFC'] . "')" .
             "\r";
      fputs($f, $str, strlen($str));
      $pos++;
      if( ($pos % 100) == 0) {
        echo "Save $pos Lines FROM $num\r\n";
      }      
    }
    fclose($f);
    odbc_close($odbc);
  }

  public function actionModels(){
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_MODELS m LEFT JOIN TOF_COUNTRY_DESIGNATIONS cd ON m.MOD_CDS_ID=cd.CDS_ID and cd.CDS_LNG_ID=16");
    $str    = 'model_id'          . "," .
              'manufacturers_id'  . "," .              
              'start'             . "," .
              'end'               . "," .
              'type'              . "," .
              'text_id'           .
              "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $start = $row['MOD_PCON_START'];
      if( $start == 0 ){
        $start = "197701";
      }

      $start_y = substr($start, 0, 4);
      $start_m = substr($start, 4, 2);      
      $start   = "01-$start_m-$start_y";
      
      /*$str = $row['MOD_ID']     . "," .
             $row['MOD_MFA_ID'] . "," .
             $row['MOD_MFA_ID'] . "," .
             $start             . "," .
             $end               . "," .
             "B('" . $row['MOD_PC'] . $row['MOD_CV'] . $row['MOD_AXL'] . "')" . "," .
             $row['CDS_TEX_ID'] .
             "\r";
      fputs($f, $str, strlen($str));
      $pos++;
      if( ($pos % 100) == 0) {
        echo "Save $pos Lines FROM $num\r\n";
      }*/
      if( $pos++ > 5){
        break;
      }
      print_r($row);
    }
    fclose($f);
    odbc_close($odbc);
  }

}
