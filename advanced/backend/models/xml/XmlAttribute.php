<?php
namespace backend\models\xml;

/**
 * @author Sync
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
    $parent_class = XmlAttribute::className();
    
    if( !($child instanceof $parent_class) ){
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
    $str = "<$this->name";
    
    foreach ($this->attributes as $attr=>$value){
      $str .= " $attr=\"$value\" ";
    }

    if( count($this->childs) == 0 && !$this->value){
      
      $str.= "/>";
      return $str;
      
    } elseif(count($this->childs)) {
      
      $str .= ">";
      foreach ($this->childs as $child){
        $str .= sprintf("%s\r",$child);
      }
      
    } else {
      
      $str .= "> \r $this->value \r ";
      
    }

    $str .= "</$this->name>";
    return $str;
  }

}
