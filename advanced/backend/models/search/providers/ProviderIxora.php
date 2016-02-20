<?php

/**
 * @author Sync
 */
namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderIxora extends Provider{
  protected $_url = "http://ws.ixora-auto.ru/soap/ApiService.asmx";
  protected $_search_text = null;

  public function getBrands($search_text, $use_analog) {
    $this->_search_text = $search_text;
    $data= ['Number'=>$search_text];
    return $this->prepareRequest($data, true,  $this->_url."/GetMakersXML");
  }

  public function getBrandsParse($xml) {
    $field = $this->getRowName();
    if( !is_array($xml) || !isset($xml[$field]) ){
      return [];
    }
    $data     = $xml[$field];
    $answer   = [];
    foreach ($data as $row){
      if( !isset($row['name']) ){
        continue;
      }
      $maker  = strtoupper($row['name']);
      $maker  = preg_replace('/\W*/i', "", $maker);
      $answer[ $maker ] = ['id' => $this->getCLSID(),'uid' => $this->_search_text . '@@' . $row['name']];
    } 
    return $answer;
  }
  
  public function getParts($ident) {
    list($code,$maker) = explode('@@', $ident);
    $data   = ['Maker'=>$maker,'Number'=>$code,'StockOnly'=>'false','SubstFilter'=>'All'];
    $reqest = $this->prepareRequest($data,true, $this->_url."/FindXML");

    $answer = $this->executeRequest($reqest);
    $array  = $this->xmlToArray($answer);
    if( !isset($array['DetailInfo']) ){
			return [];
    }
		
    $data   = $array['DetailInfo'];
    $result = [];
    foreach ($data as $item){
      $converted = $this->renameByMap($item, $this->getNamesMap());
			$converted['is_original'] = ($converted['is_original']==='Analog')?false:true;
      $result[] = $converted;
    }
    return $result;    
  }

  protected function getNamesMap() {
    return [
      "number"      		=> "articul",
      "maker"  					=> "maker",
      "orderreference"  => "code",
      "name"   					=> "name",
      "price"     			=> "price",
      "dayswarranty" 		=> "shiping",
      "region"     			=> "stock",
      "group"    				=> "is_original",
      "quantity"	      => "count",
      "lotquantity"    	=> "lot_quantity"
    ];
  }

  protected function getRowName() {
    return 'MakerInfo';
  }

}
