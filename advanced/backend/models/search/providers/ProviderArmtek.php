<?php

namespace backend\models\search\providers;
use backend\models\search\ProviderFile;

class ProviderArmtek extends ProviderFile{

  public function loadFromFile() {
    $path = $this->getPath();

    if( !is_dir($path) ){
      throw new \yii\base\InvalidValueException('Field "path" must be directory');
    }
    $timestamp = time();
    $files = scandir($path);

    $this->clearPrice();

    foreach ($files as $file){
      if(is_dir($file) ){
        continue;
      }
      echo "loading $file \r\n";      
      $this->loadFile($path."/".$file);
      unlink($path."/".$file);
    }
    $timestamp = time() - $timestamp;
    echo "Load by $timestamp sec. \r\n";
  }

  protected function loadFile($file){
    if( !$file ){
      return;
    }

    $sheet      = simplexml_load_file("zip://" . $file . "#xl/worksheets/sheet1.xml");
    $strings    = simplexml_load_file("zip://" . $file . "#xl/sharedStrings.xml");
    $convert    = [];
    $str_data   = [];

    foreach ($strings->children() as $item) {
      $str_data[] = strval($item->t);
    }

    foreach ($sheet->sheetData->children() as $row){
      /* @var $row \SimpleXMLElement */
      $attr = $row->attributes();
      $line = intval($attr['r']);      
      $convert[$line] = [];
      foreach ($row as $data){
        $dattr  = $data->attributes();
        $type   = isset($dattr['t'])?$dattr['t']:false;
        $col    = ord(substr($dattr['r'], 0,1)) - 0x41;
        $val    = isset($data->v)?intval($data->v):-1;
        $convert[$line][$col] = ($type=="s")?$str_data[$val]:$val;
      }      
    }

    unset($convert[1]);
    unset($sheet);
    unset($strings);

    foreach ($convert as $row){
      $visula_articul = $row[3];
      $articul        = $row[1];
      $maker          = $row[0];
      $name           = $row[2];
      if( !$articul || !$maker ){
        continue;
      }

      $newPriceRecord = new \backend\models\price\PriceModel();
            
      $newPriceRecord->setAttribute('pid',            $this->_CLSID);
      $newPriceRecord->setAttribute('articul',        $articul);
      $newPriceRecord->setAttribute('visual_articul', $visula_articul);
      $newPriceRecord->setAttribute('maker',          $maker);
      $newPriceRecord->setAttribute('name',           $name);
      $newPriceRecord->setAttribute('price',          floatval($row[6]));
      $newPriceRecord->setAttribute('count',          intval($row[5]));
      $newPriceRecord->setAttribute('lot_quantity',   1);
      $newPriceRecord->save();      
    }

  }

}
