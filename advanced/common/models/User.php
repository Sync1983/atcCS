<?php
namespace common\models;

use yii\base\NotSupportedException;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;

class User extends ActiveRecord implements IdentityInterface {
  const IS_USER     = 0;
  const IS_ADMIN    = 1;  

  public function attributes() {
    return ['id', 'user_name', 'user_pass', 'role', 'over_price', 'credit', 'is_init', 'shiping'];
  }

  public static function tableName() {
    return 'Users';
  }

  public function rules(){
    return [      
      ['user_name','string','max' => 100],
      ['user_pass','string','max' => 62],
      ['role','integer'],
      ['role','in','range'=>[static::IS_USER, static::IS_ADMIN]],
      ['over_price','integer','min' => 0],
      [['credit','shiping'],'integer','min' => 0],
      ['is_init','integer'],
      ['is_init','in','range'=>[0,1]],
      [['user_name', 'user_pass', 'role', 'over_price', 'credit', 'is_init'],'safe'],
    ];
  }

  public static function findIdentity($id) {
    return static::findOne(['id' => $id, 'status' => self::STATUS_ACTIVE]);
  }

  public static function findIdentityByAccessToken($token, $type = null) {
    throw new NotSupportedException('"findIdentityByAccessToken" is not implemented.');
  }

  public static function findByUsername($username) {
    return static::findOne(['user_name' => $username]);
  }

  public function getId() {
    return $this->getPrimaryKey();
  }

  public function isAdmin(){
    return $this->getAttribute('role')==self::IS_ADMIN;
  }

  public function validatePassword($password) {
    return \yii::$app->security->validatePassword($password, $this->user_pass);
  }

  public function setPassword($password) {
    $this->user_pass = \yii::$app->security->generatePasswordHash($password);
  }

  public function getAuthKey() {
    throw new NotSupportedException('"getAuthKey" is not implemented.');
  }

  public function validateAuthKey($authKey) {
    throw new NotSupportedException('"validAuthKey" is not implemented.');
  }

}
