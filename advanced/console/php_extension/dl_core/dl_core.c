#include "php.h"

PHP_FUNCTION(dl_core);
PHP_FUNCTION(dl_array);

const zend_function_entry dl_core_functions[] = {
	PHP_FE(dl_core, NULL)
	PHP_FE(dl_array, NULL)
	{NULL, NULL, NULL}
};

zend_module_entry dl_core_module_entry = {
	STANDARD_MODULE_HEADER,       // #if ZEND_MODULE_API_NO >= 20010901
	"dl_core",                    // название модуля
	dl_core_functions,               // указываем экспортируемые функции
	NULL,                         // PHP_MINIT(test), Module Initialization
	NULL,                         // PHP_MSHUTDOWN(test), Module Shutdown
	NULL,                         // PHP_RINIT(test), Request Initialization
	NULL,                         // PHP_RSHUTDOWN(test), Request Shutdown
	NULL,                         // PHP_MINFO(test), Module Info (для phpinfo())
	"0.1",                        // версия нашего модуля
	STANDARD_MODULE_PROPERTIES
};

ZEND_GET_MODULE(dl_core)


#define MIN(a,b) (((a)<(b))?(a):(b))
#define MAX(a,b) (((a)>(b))?(a):(b))

int dl_core_core(char *S1, char *S2, int N, int M)
{
  int D1 = 0, D2 = 0, D3 = 0, D4 = 0,distance = 0;
  
  if( MIN(N,M) <= 0 ){
    return MAX(N,M);    
  }
      
  char AN = S1[N-1];
  char BM = S2[M-1];
        
  if( (N > 2) && (M > 2) ){
               
    char AN1 = S1[N-2];
    char BM1 = S2[M-2];
                        
    if( (AN == BM1) && (AN1 == BM) ){
      
      D1 = dl_core_core(S1,S2,N-1,M) + 1;
      D2 = dl_core_core(S1,S2,N,M-1) + 1;
      D3 = dl_core_core(S1,S2,N-1,M-1);
      D4 = dl_core_core(S1,S2,N-2,M-2) + 1;
                                                        
      if( AN != BM ){
        D3 += 1;
      }
                                                              
      distance = MIN(D1,D2);
      distance = MIN(distance,D3);
      distance = MIN(distance,D4);
                                                        
      return distance;
    }    

  }
            
  D1 = dl_core_core(S1,S2,N-1,M) + 1;
  D2 = dl_core_core(S1,S2,N,M-1) + 1;
  D3 = dl_core_core(S1,S2,N-1,M-1);
                  
  if( AN != BM ){
    D3 += 1;
  }
                    
  distance = MIN(D1,D2);
  distance = MIN(distance,D3);
                        
  return distance;

} 


PHP_FUNCTION(dl_core)
{
  char *S1;
  char *S2;
  int N;
  int M;
  long distance = 0;

  if (zend_parse_parameters(ZEND_NUM_ARGS() TSRMLS_CC, "ss", &S1, &N, &S2, &M) == FAILURE) {
    RETURN_NULL();
  } 

  distance = dl_core_core(S1,S2,N,M);
	
	RETURN_LONG(distance);
}

PHP_FUNCTION(dl_array)
{
  zval          *arr, **row;
  HashTable     *arr_hash;
  HashPosition  pointer;
  
  int   arr_count;  
  char  *text;  
  char  *text_part;  
  int   str_len;
  int   offset    = 0;
  
  long  distance = 0;

  if (zend_parse_parameters(ZEND_NUM_ARGS() TSRMLS_CC, "asd", &arr, &text, &str_len, &offset) == FAILURE) {
    RETURN_NULL();
  } 
  
  arr_hash  = Z_ARRVAL_P(arr);
  arr_count = zend_hash_num_elements(arr_hash);
  
  text_part = (char *)emalloc(str_len + 2);
  
  for(  zend_hash_internal_pointer_reset_ex(arr_hash, &pointer); 
        zend_hash_get_current_data_ex(arr_hash, (void**) &row, &pointer) == SUCCESS; 
        zend_hash_move_forward_ex(arr_hash, &pointer)) {
    
    RETURN_ZVAL(Z_ARRVAL_PP(row), 1, 0);// add_assoc_long(Z_ARRVAL_PP(row),"distance",5);
  }

  efree(text_part + 2);
  //distance = dl_core_core(S1,S2,N,M);
	
	RETURN_LONG(distance);
}
