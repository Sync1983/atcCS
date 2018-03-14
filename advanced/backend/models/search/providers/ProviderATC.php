<?php

namespace backend\models\search\providers;
use backend\models\search\ProviderFile;
use common\models\stock\Stock;

class ProviderATC extends ProviderFile{
  protected $_url = "";
  
  protected function getNamesMap() {
    return [
      "PIN"       => "articul",
      "BRAND"  	 => "maker",
      "NAME"  	 => "name",
      "PRICE"    => "price",
      "RVALUE"   => "count",
      "RDPRF"    => "lot_quantity"
    ];
  }  

  public function getBrands($search_text, $use_analog) {    
    $result = Stock::find()
                -> select(['articul','maker'])
                -> distinct()
                -> where(['like', 'articul', $search_text.'%',false])
                -> asArray()
                -> all();
    $answer = [];
    foreach ($result as $row){      
      $name = $row['maker'];
      $answer[$name] = ['id'=>$this->getCLSID(), 'uid'=>$name. "@@" .$row['articul']];
    }    
    return $answer;
  }


  public function getParts($ident, $searchText) {
    list($brand,$articul) = explode('@@',$ident);

    $result = Stock::find()
                -> select(['articul','maker','name','count','price'])
                -> where(['maker' => $brand])
                -> andWhere(['articul' => $articul])
                -> asArray()
                -> all();
    $answer = [];    
    foreach ($result as $row){
      $converted = [];
      $converted['articul']   = $row['articul'];
      $converted['maker']     = $row['maker'];
      $converted['name']      = $row['name'];
      $converted['is_analog'] = false;
      $converted['shiping']   = 0;
      $converted['price']     = floatval($row['price']);
      $converted['stock']         = "Склад";
      $converted['count']         = $row['count'];
      $converted['lot_quantity']  = 1;
      $answer[] = $converted;
    }
    return $answer;
  }

  public function getPartsParse($json){    

    foreach($data as $row){      
      
    }
    return $answer;
  }

  protected function getRowName() {}

  public function loadFromFile() {

  }

}
