<?php

/**
 * @author sync1983
 */

namespace console\controllers;
use yii\console\Controller;

class TdLoadController extends Controller{

  public function actions() {
    return [      
      'article'       => actions\tdload\ArticleLoadAction::className(),
      'article-info'  => actions\tdload\ArticleInfoLoadAction::className(),
      'suppliers'     => actions\tdload\SuppliersLoadAction::className(),
      'brands'        => actions\tdload\BrandsLoadAction::className(),
      'description'   => actions\tdload\DescriptionLoadAction::className(),
      'manufacturers' => actions\tdload\ManufacturersLoadAction::className(),
      'models'        => actions\tdload\ModelsLoadAction::className(),
      'types'         => actions\tdload\TypesLoadAction::className(),
      'texts'         => actions\tdload\TextsLoadAction::className(),
      'links'         => actions\tdload\LinksLoadAction::className(),
      'links-art'     => actions\tdload\LinksArtLoadAction::className(),
      'gen-art'       => actions\tdload\GenArtLoadAction::className(),
      'search-tree'   => actions\tdload\SearchTreeLoadAction::className(),
      'str-lookup'    => actions\tdload\StrLookupLoadAction::className()
    ];
  }

}
