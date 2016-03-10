<?php
namespace backend\controllers;

use yii\web\Controller;
use yii\base\InvalidCallException;

class SoapController extends Controller {

  public $enableCsrfValidation = false;  
    
  public function behaviors() {
    return [
      /*'authFilter' => [
        'class'       => \backend\filters\RestAuthFilter::className(),
        'auth'        => [\backend\controllers\user\LoginAction::className(),'authHttpBasic'],
        'authToken'   => [\backend\controllers\user\LoginAction::className(),'authToken'],
        'exceptMethods' => ['OPTIONS'],
        'exceptActions' => [],
      ],*/
    ];
  }
    
  public function actions() {
    return [
      'error' => [
        'class' => InvalidCallException::class,
      ],
    ];
  }

  public function controllers(){
    return [
      'users' => soap\SoapUsers:: className(),
    ];
  }

  public function renderContent($view) {
    echo 123;
    \yii::info("Render");
  }

  public function runAction($id, $params = array()) {
    $response = \yii::$app->getResponse();
    $response->format = 'soap';

    $response->acceptMimeType = null;
    $response->acceptParams = [];

    $controller_name  = \yii\helpers\ArrayHelper::getValue($params, 'item', false);
    $wsdl_query       = \yii\helpers\ArrayHelper::keyExists('wsdl', $params) || \yii\helpers\ArrayHelper::keyExists('WSDL', $params);
    /* @var $controller rest\RestItemController */
    $controller = $this->getController($controller_name);
    if( !$controller ){
      throw new \yii\base\InvalidRouteException("Не указан объект запроса");
    }

    if( $wsdl_query ){
      $id = 'wsdl';
    }

    if( !$controller->hasMethod($id) ) {
      throw new \yii\base\InvalidParamException("Неизвестный способ обработки запроса ['$id']");
    }
    
    return $controller->$id();    
  }
  
  /**
   *  Возвращает запрашиваемы подконтроллер
   * @param string $name Имя контроллера
   * @return mixed Контроллер, или false в случае ошибки
   */
  public function getController($name){
    $list = $this->controllers();
    
    if( !isset($list[$name]) ) {
      return false;
    }

    $controller = $list[$name];
    if( !$controller ){
      return false;
    }

    if( is_array($controller) ){
      $name = \yii\helpers\ArrayHelper::getValue($controller, 'class', '');
      unset($controller['name']);
      return \yii::createObject($name,$controller);
    }

    if(is_string($controller) ){
      return \yii::createObject($controller);
    }

    return false;
  }
    
}
