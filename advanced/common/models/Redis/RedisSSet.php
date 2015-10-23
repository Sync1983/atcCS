<?php

/**
 * @author sync1983
 */

namespace common\models\Redis;

use yii\base\Model;
use yii\helpers\ArrayHelper;

class RedisSSet extends Model{
  const EVENT_INIT = "INIT";
  
  public $primaryKey = [];
  private $_values = [];

  public static function prefixKey() {
    return 'sset::';
  }

  /**
   * Добавляет записи к элементу
   * @param type $values Массив новых значений
   * @param type $runValidation Валидировать новые значения
   * @return boolean
   */
  public function append($values = [],$runValidation = true) {
    if( !is_array($values) ) {
      $values = [ $values ];
    }

    if ( $runValidation && !$this->validate($values) ) {
      return false;
    }

    if (!$this->beforeSave(true)) {
      return false;
    }

    $db = static::getDb();

    if( $db->executeCommand("SADD", array_merge([$this->getPrimaryKey()],$this->serilize($values)) ) ) {
      $this->load();
      return true;
    }
    return false;
  }
  /**
   * Возвращает общие элементы двух объектов
   * @param \common\models\Redis\RedisSSet $sset объект для сравнения
   * @return boolean
   */
  public function different($sset){

    if( $sset instanceof RedisSSet ){
      $db = static::getDb();
      return $db->executeCommand("SDIFF", [$this->getPrimaryKey(), $this->getPrimaryKey(), $sset->getPrimaryKey() ]);
    }

    return false;
  }
  /**
   * Сравнивает объекты
   * @param type $sset Объект для сравнения
   * @return type
   */
  public function equal($sset){
    return $this->different($sset) === [];
  }
  /**
   * Возвращает длину записи
   * @return integer Количество элементов
   */
  public function length(){
    return count($this->_values);
  }
  /**
   * Удаляет значения из множества
   * @param mixed $values Массив удаляемых значений
   * @return type
   */
  public function remove($values = []){
    $db = static::getDb();
    return $db->executeCommand("SREM", [$this->getPrimaryKey(), $this->serilize($values)]);
  }
  /**
   * Удаляет ключ и всё множество
   * @return boolean
   */
  public function delete() {
    $db = static::getDb();
    return $db->executeCommand("DEL", [$this->getPrimaryKey()] );
  }
  /**
   * Проверяет существует ли указанное значение во множестве
   * @param string $value
   * @return boolean
   */
  public function hasValue($value){    
    return in_array(serialize($value), $this->_values);
  }
  /**
   * Возвращает значения или часть значений из множества
   * @param type $offset Позиция от начала множества
   * @param type $length Количество элементов
   * @return mixed
   */
  public function getValues($offset = 0, $length = 0) {
    $values = $this->_values;
    if( $length ){
      $values = array_slice($this->_values, $offset, $length);
    }

    return $this->unserilize($values);
  }
  /**
   * Возвращает и УДАЛЯЕТ один или больше СЛУЧАЙНЫХ элементов из множества
   * @param integer $length Количество элементов
   * @return mixed Массив элементов или false в случае неудачи
   */
  public function pop($length = 0){
    $db = static::getDb();
    $params = [$this->getPrimaryKey()];
    if( $length ){
      $params[] = $length;
    }
    if( $value = $db->executeCommand("SPOP", $params) ){
      $this->load();
      return $this->unserilize($value);
    }
    return false;
  }
  /**
   * Возвращает один или больше СЛУЧАЙНЫХ элементов из множества
   * @param integer $length Количество элементов
   * @return mixed Массив элементов или false в случае неудачи
   */
  public function random($length = 0){
    $db = static::getDb();
    $params = [$this->getPrimaryKey()];
    if( $length ){
      $params[] = $length;
    }
    if( $value = $db->executeCommand("SRANDMEMBER", $params) ){
      return $this->unserilize($value);
    }
    return false;
  }
  /**
   * Возвращает базу данных Redis
   * @return \yii\redis\Connection
   */
  public static function getDb() {
    return \Yii::$app->get('redis');
  }
  /**
   * Первичный ключ
   * Функция должна вернуть массив либо строку ключа
   * @return mixed Строка либо массив ключа
   * @throws NotSupportedException
   */
  public function primaryKey() {
    if ( !$this->primaryKey || ( is_array($this->primaryKey) && ( count($this->primaryKey) == 0 ) ) ){
      throw new NotSupportedException(__METHOD__ . ' is not supported.');
    }    
    return $this->primaryKey;
  }

  public function getPrimaryKey($asArray = false) {
    $key = $this->primaryKey();

    if( !is_array($key) ) {
      $key = [$key];
    }

    if( $asArray ){
      return $key;
    }

    return $this->prefixKey() . implode("::", $key);
  }

  public function load(){
    $db = static::getDb();
    $this->_values = $db->executeCommand("SMEMBERS",[$this->getPrimaryKey()]);
  }

  public function init() {
    parent::init();
    $this->load();
    $this->trigger(self::EVENT_INIT);
  }

  public function validate(){
    return true;
  }

  public function beforeSave(){
    return true;
  }

  public function serilize($values = []){
    return array_map(function($item){
              return serialize($item);
            },
            $values
           );
  }

  public function unserilize($values = []){
    return array_map(function($item){
              return unserialize($item);
            },
            $values
           );
  }

}
