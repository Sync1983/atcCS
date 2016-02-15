<?php

namespace backend\models\search\providers;
use backend\models\search\ProviderFile;

class ProviderForum extends ProviderFile{

  public function loadFromFile() {
    $path = $this->getPath();

    if( !is_dir($path) ){
      throw new \yii\base\InvalidValueException('Field "path" must be directory');
    }
    $timestamp = time();
    $files = scandir($path);
    foreach ($files as $file){
      if(is_dir($file) ){
        continue;
      }
      echo "loading $file \r\n";
      $fp = fopen($path . "/" . $file, "r");
      $this->loadFile($fp);
      fclose($fp);
      unlink($path . "/" . $file);
    }
    $timestamp = time() - $timestamp;
    echo "Load by $timestamp sec. \r\n";
  }

  protected function loadFile($fp){
    if( !$fp ){
      return;
    }
    
    $header = fgetcsv($fp);
    $header = implode(",", $header);
    $header = mb_convert_encoding($header, "UTF-8", "CP1251");
    if( !feof($fp) ){
      $this->clearPrice();
    }
    while( !feof($fp) ){
      $data           = fgetcsv($fp,0,";");
      $visula_articul = $data[1];
      $articul        = preg_replace('/\W*/i', "", $visula_articul);
      $maker          = mb_convert_encoding($data[0], 'UTF-8', 'CP1251');
      $name           = mb_convert_encoding($data[2], 'UTF-8', 'CP1251');
      if( !$articul || !$maker ){
        continue;
      }
      $newPriceRecord = new \backend\models\price\PriceModel();

      $newPriceRecord->setAttribute('pid',            $this->_CLSID);
      $newPriceRecord->setAttribute('articul',        $articul);
      $newPriceRecord->setAttribute('visual_articul', $visula_articul);
      $newPriceRecord->setAttribute('maker',          $maker);
      $newPriceRecord->setAttribute('name',           $name);
      $newPriceRecord->setAttribute('price',          floatval($data[3]));
      $newPriceRecord->setAttribute('count',          intval($data[4]));
      $newPriceRecord->setAttribute('lot_quantity',   intval($data[5]));
      try{
        $newPriceRecord->save();
      } catch (\yii\db\Exception $ex) {        
      }
    }
  }

}
