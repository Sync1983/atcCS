<?php

/**
 * @author Sync
 */
namespace backend\models\search;

interface SearchInterface {
  public function getBrands($search_text,$use_analog);
  public function getBrandsParse($xml);
  public function getParts($ident);
}
