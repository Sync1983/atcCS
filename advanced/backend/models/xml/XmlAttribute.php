<?php
namespace backend\models\xml;

/**
 * @author Sync
 * @property String $value Текстовое значение внутри тэга 
 */
class XmlAttribute extends \yii\base\Object{

  protected $name         = null;
  protected $value        = null;
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
  
  public function getvalue(){
    return $this->value;
  }
  
  public function setvalue($value){
    $this->value = strval($value);
  }

  public function getChilds(){
    return $this->childs;
  }
  /**
   * Добавляет потомка к Аттрибуту
   * @param XmlAttribute $child
   */
  public function appendChild($child){
    if( !$child ){
      return;
    }
    
    $parent_class = XmlAttribute::className();

    if( !is_array($child) ){
      $childs = [$child];
    } else {
      $childs = $child;
    }

    foreach ($childs as $child) {
      if( !($child instanceof $parent_class) ){
        throw new \InvalidArgumentException("Потомок должен иметь тип " . XmlAttribute::className() . " или его потомков");
      }

      $this->childs[] = $child;
    }
    
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
    $format_long  = "\n<%s%s>%s  %s</%s>";
    $format_short = "\n<%s%s/>";
    $childs       = "";
    $attributes   = "";
    $value        = "";

    if( !count($this->attributes) && !count($this->childs) && !$this->value){
      return "";
    }

    $format = $format_short;
    if( $this->value || count($this->childs)){
      $format = $format_long;
    }

    foreach ($this->attributes as $attr=>$value){
      $attributes .= " $attr=\"$value\"";
    }

    foreach ($this->childs as $child){
      $text = "$child";
      if( !$text ){
        continue;
      }
      $childs .= $text;
    }
    
    return sprintf($format,  $this->name, $attributes, $this->value, $childs, $this->name);
  }

}
