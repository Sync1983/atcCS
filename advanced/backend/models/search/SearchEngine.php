<?php

/**
 * @author Sync
 */
namespace backend\models\search;
use yii\base\BaseObject;
use yii\base\InvalidConfigException;

class SearchEngine extends BaseObject{
  protected $providers;
  
  public function init() {
    $provider_list    = \yii\helpers\ArrayHelper::getValue(\yii::$app->params, 'providers',[]);
    $this->providers  = [];
    foreach ($provider_list as $provider_data){
      
      if( !is_array($provider_data) ){
        throw new InvalidConfigException('Provider data must be array with values [class,name,CLSID]');
      }
      
      $class  = \yii\helpers\ArrayHelper::getValue($provider_data, 'class',false);
      $name   = \yii\helpers\ArrayHelper::getValue($provider_data, 'name', false);
      $CLSID  = \yii\helpers\ArrayHelper::getValue($provider_data, 'CLSID',false);
      $fields = \yii\helpers\ArrayHelper::getValue($provider_data, 'fields',[]);
      
      if( !$class || !$name || !$CLSID){
        throw new InvalidConfigException('Provider data must be array with values [class,name,CLSID]');
      }

      $new_class = \yii::createObject($class,[$CLSID,$name,$fields]);
      
      $this->providers[$new_class->getCLSID()] = $new_class;
      
    }
    return parent::init();
  }

  public function getBrands($search_text,$use_analog){
    $response = $this->providersMap('getBrands', ['search_text'=>$search_text,'use_analog'=>$use_analog]);
    $answer   = [];    
    foreach ($response as $row){      
      foreach ($row as $name => $data){
        $name = $this->brandsRename($name);
        if ( !isset($answer[$name]) ){
          $answer[$name] = [];
        }
        $answer[$name][] = $data;
      }
    }    
    return $answer;
  }

  public function getParts($clsid, $ident, $searchText){
    if( !$clsid || !$ident || !isset($this->providers[$clsid]) ){
      return [];
    }    
    /* @var $provider SearchInterface */
    $provider = $this->providers[$clsid];
    $result   = $provider->getParts($ident, $searchText);
    $isGuest  = \yii::$app->user->isGuest;
    $user     = \yii::$app->user->getIdentity();
    
    $standart_markup  = \yii\helpers\ArrayHelper::getValue(\yii::$app->params, 'guestOverPrice', 23);
    $standart_shiping = \yii\helpers\ArrayHelper::getValue(\yii::$app->params, 'guestShiping', 1);
    $markup   = $isGuest?$standart_markup :$user->over_price * 1;
    $shiping  = $isGuest?$standart_shiping:$user->shiping * 1;
    
    foreach ($result as &$row){
      $price          = floatval($row['price']);

      if( is_object($user) && $user->isAdmin() ){
        $row['prvd']    = $provider->getName();        
      }
      
      $row['maker_id']  = $clsid; 
      $row['rp']        = round($price,2);
      $row['price']     = round($price + ($price*$markup)/100,2);
      $maker            = mb_convert_encoding($row['maker'], 'UTF-8', 'UTF-8');//$maker          = preg_replace('/\W*/i', "", $row['maker']);
      $row['maker']     = $this->brandsRename(strtoupper($maker));
      $row['articul']   = preg_replace('/\W*/i', "", $row['articul']);
      $row['shiping']   = intval($row['shiping']) + $shiping;
    }
    
    $struct = [];
    foreach ($result as &$row){
      $maker = $row['maker'];
      if( !isset($struct[$maker])){
        $struct[$maker] = [];
      }
      $struct[$maker][] = $row;
    }

    return $struct;
  }

  protected function providersMap($method,$data){
    $requests     = curl_multi_init();
    $requestsList = [];
    $results      = [];
    /* @var $provider Provider */
    foreach ($this->providers as $provider){      
      if( !method_exists($provider, $method) ){
        continue;
      }
      
      if( is_subclass_of($provider, ProviderFile::className()) ){
        $results[$provider->getCLSID()] = $provider->getBrands($data['search_text'], $data['use_analog']);
        continue;
      }
      $request = call_user_func_array([$provider,$method], $data);
      $requestsList[$provider->getCLSID()] = $request;
      curl_multi_add_handle($requests,$request);      
    }

    $active = null;

    do {
      $requests_state = curl_multi_exec($requests, $active);
    } while ($requests_state == CURLM_CALL_MULTI_PERFORM);
   
    while ($active && $requests_state == CURLM_OK) {
      if (curl_multi_select($requests) == -1) {
        usleep(10);
      }      

      do {
        $requests_state = curl_multi_exec($requests, $active);
        if( $requests_state > 0){
          \yii::info("Curl Error: ".  curl_multi_strerror($requests_state));
        }
      } while ($requests_state == CURLM_CALL_MULTI_PERFORM);
    }   

     
    foreach ($requestsList as $clsid => $request){
      $answer = curl_multi_getcontent($request);
      curl_multi_remove_handle($requests, $request);
      try{
        $results[$clsid] = $this->providers[$clsid]->parseResponse($answer,$method);
      }catch(Exception $e) {        
      }
    }

    curl_multi_close($requests);
    return $results;
  }

  protected function brandsRename($brand){    
    $brand = preg_replace('/[\-, ,-,\/]*/', "", $brand);
    
    $renameMap = [
      'KIAHYUNDAIMOBIS' => 'HYUNDAI-KIA-MOBIS',
      'HYUNDAIKIA'      => 'HYUNDAI-KIA-MOBIS',
      'HYUNDAIKIAMOBIS' => 'HYUNDAI-KIA-MOBIS',
      'HYUNDAI'         => 'HYUNDAI-KIA-MOBIS',
      'HYUNDAI/KIA MOBIS'=> 'HYUNDAI-KIA-MOBIS',
      'MOBIS'           => 'HYUNDAI-KIA-MOBIS',
      'KIA'             => 'HYUNDAI-KIA-MOBIS',
      'MB'              => 'MERCEDES-BENZ',
      'MERCEDES'        => 'MERCEDES-BENZ',
      'MERCEDESBENZ'    => 'MERCEDES-BENZ',      
      'CITROENPEUGEOT'  => 'CITROEN-PEUGEOT',
      'PEUGEOT'         => 'CITROEN-PEUGEOT',
      'CITROEN'         => 'CITROEN-PEUGEOT',
      'GMOPELCHEVROLETDAEWOO' => 'GM-OPEL-CHEVROLET-DAEWOO',
      'GENERALMOTORS'   => 'GM-OPEL-CHEVROLET-DAEWOO',
      'DAEWOO'          => 'GM-OPEL-CHEVROLET-DAEWOO',
      'CHEVROLET'       => 'GM-OPEL-CHEVROLET-DAEWOO',
      'OPEL'            => 'GM-OPEL-CHEVROLET-DAEWOO',
      'GM'              => 'GM-OPEL-CHEVROLET-DAEWOO',
      'CHRYSLERDODGEMOPAR' => 'CHRYSLER-DODGE-MOPAR',
      'MOPAR'           => 'CHRYSLER-DODGE-MOPAR',
      'DODGE'           => 'CHRYSLER-DODGE-MOPAR',
      'CHRYSLER'        => 'CHRYSLER-DODGE-MOPAR',
      'HANS PRIES'      => 'HANS-PRIES',
      'HANSPRIES'       => 'HANS-PRIES'
    ];
    
    return isset($renameMap[$brand])?$renameMap[$brand]:$brand;

  }
  
}
