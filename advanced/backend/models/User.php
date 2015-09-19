<?php
namespace backend\models;

use Yii;
use yii\base\NotSupportedException;
use yii\behaviors\TimestampBehavior;
use yii\web\IdentityInterface;
use yii\mongodb\ActiveRecord;
use yii\helpers\ArrayHelper;

/**
 * User model
 *
 * @property integer $id
 * @property string $username
 * @property string $password_hash
 * @property string $password_reset_token
 * @property string $email
 * @property string $auth_key
 * @property integer $status
 * @property integer $created_at
 * @property integer $updated_at
 * @property string $password write-only password
 */
class User extends ActiveRecord implements IdentityInterface {

  public static function createNew($login,$pass,$name="new name"){
    $old_user = User::findByUsername($login);
    if($old_user && (bool) $login && (bool) $pass){
      return false;
    }

    $user = new User();
    $user->user_name      = $login?$login:$name;        //Логин
    $user->user_pass      = $user->setPassword($pass);  //Пароль
    $user->role           = "user";     //Роль пользователя
    $user->over_price     = ArrayHelper::getValue(\yii::$app->params, 'guestOverPrice', 18.0);  //Наценка для пользователя
    $user->type           = "private";  //Тип
    $user->first_name     = $name?$name:$login; //Имя
    $user->second_name    = "";        //Фамилия    
    $user->name           = "";        //Название фирмы
    $user->inn            = "";        //ИНН фирмы
    $user->kpp            = "";        //КПП фирмы
    $user->addres         = "";        //Адрес доставки
    $user->phone          = "";        //Телефон для связи
    $user->email          = "";        //Почта для связи
    $user->credit         = 0.0;       //Кредит пользователя
    $user->over_price_list= [];        //Список наценок пользователя
    $user->basket         = [];        //Записи корзины
    $user->orders         = [];        //Записи активных заказов
    $user->informer       = ["Спасибо за регистрацию!"];        //Записи информера
    $user->is_init        = false;     //Проведена ли начальная настройка
    if( $user->insert() ){
      return $user;
    }
    return FALSE;
  }

  public static function collectionName() {
      return 'users';
  }

  public function behaviors() {
    return [
        'ts' => [
          'class'              => TimestampBehavior::className(),
          'createdAtAttribute' => 'create_time',
          'updatedAtAttribute' => 'update_time'
        ]
      ];
  }

  public function attributes(){
    return [
      '_id',
      'user_name',        //Логин
      'user_pass',        //Пароль
      'role',             //Роль пользователя
      'over_price',       //Наценка для пользователя
      'first_name',       //Имя
      'second_name',      //Фамилия
      'type',             //Тип
      'name',             //Название фирмы
      'inn',              //ИНН фирмы
      'kpp',              //КПП фирмы
      'addres',           //Адрес доставки
      'phone',            //Телефон для связи
      'email',            //Почта для связи
      'over_price_list',  //Список наценок пользователя
      'credit',           //Кредит пользователя
      'basket',           //Записи корзины
      'orders',           //Записи активных заказов
      'informer',         //Записи сообщений
      'is_init',          //Проведены ли начальные настройки
      'create_time',
      'update_time'
      ];
  }

  public function rules(){
    return[
      [
        ['user_name','user_pass','role','over_price','first_name','second_name',
         'type','name','inn','kpp','addres','phone','email','credit','is_init','basket','orders','create_time',
         'update_time'],'safe'
      ],
    ];
  }

  //================ Auth functions ========================
  public static function findIdentity($id) {
    return static::findOne(['id' => $id]);
  }

  public static function findIdentityByAccessToken($token, $type = null) {
    Yii::info("Token: $token  Type: $type");
    throw new NotSupportedException('"findIdentityByAccessToken" is not implemented.');
  }

  public static function findByUsername($username) {
    return static::findOne(['user_name' => $username]);
  }

  public static function findByPasswordResetToken($token) {
    if (!static::isPasswordResetTokenValid($token)) {
      return null;
    }

    return static::findOne(['password_reset_token' => $token]);
    
  }

  public static function isPasswordResetTokenValid($token) {
    if (empty($token)) {
      return false;
    }

    $timestamp = (int) substr($token, strrpos($token, '_') + 1);
    $expire = Yii::$app->params['user.passwordResetTokenExpire'];
    return $timestamp + $expire >= time();
  }

  public function getId() {
    return $this->getPrimaryKey();
  }

  public function getAuthKey() {
    return $this->auth_key;
  }

  public function validateAuthKey($authKey) {
    return $this->getAuthKey() === $authKey;
  }

  public function validatePassword($password) {
    return Yii::$app->security->validatePassword($password, $this->user_pass);
  }

  public function setPassword($password) {
    return \yii::$app->security->generatePasswordHash($password);
  }

  public function generateAuthKey() {
    return  Yii::$app->security->generateRandomString();
  }

  public function generatePasswordResetToken() {
    return Yii::$app->security->generateRandomString() . '_' . time();
  }

  public function removePasswordResetToken() {
    $this->password_reset_token = null;
  }
  
}
