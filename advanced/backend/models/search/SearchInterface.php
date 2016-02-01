<?php

/**
 * @author Sync
 */
namespace backend\models\search;

interface SearchInterface {
  
  public function getID();
  public function getBrands($search_text,$use_analog);
}
