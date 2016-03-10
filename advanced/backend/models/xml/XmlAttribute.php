<?php
namespace backend\models\xml;

/**
 * @author Sync
 */

class XmlAttribute extends \yii\base\Object{

  protected $name         = null;
  protected $parent       = null;
  protected $childs       = [];
  protected $attributes   = [];

  public function __construct($name, $config = array()) {
    parent::__construct($config);

    if( !isset($config['name']) && !$name ){
      throw new \yii\base\InvalidConfigException("Для создания объекта необходимо задать ему имя");
    }

    $this->name = $name?$name:$config['name'];
  }

  public function getparent(){
    return $this->parent;
  }

  public function getChilds(){
    return $this->childs;
  }
  /**
   * Добавляет потомка к Аттрибуту
   * @param XmlAttribute $child
   */
  public function appendChild($child){

    if( !is_a($child, 'XmlAttribute' ) ){
      throw new \InvalidArgumentException("Потомок должен иметь тип " . XmlAttribute::className() . " или его потомков");
    }
    
    $this->childs[] = $child;
  }

  public function setAttributes($attribute,$value=null){
    if( is_string($attribute)  && ($value !== null ) ){
      $this->attributes[$attribute] = $value;
    } elseif( is_array($attribute) ){
      foreach ($attribute as $key=>$attr_value){
        $this->attributes[$key] = $attr_value;
      }
    }
  }

  public function __toString(){
    $str = "<$this->name ";
    foreach ($this->attributes as $attr=>$value){
      $str .= "$attr=\"$value\" \r";
    }

    if( count($this->childs) == 0 ){
      $str.= " />";
      return $str;
    } else {
      $str .= ">";
    }

    foreach ($this->childs as $child){
      $str .= sprintf("%s\r",$child);
    }
    $str .= "</$this->name>";
    return $str;
  }

}
