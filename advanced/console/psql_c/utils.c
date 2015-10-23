#include <postgres.h>
#include <fmgr.h>

#ifdef PG_MODULE_MAGIC
	PG_MODULE_MAGIC;
#endif

PG_FUNCTION_INFO_V1(dem_lev_distance);

int dem_lev_min(int a,int b)
{
  if( a <= b ){
    return a;
  }
  return b;
}

int dem_lev_max(int a,int b)
{
  if( a >= b ){
    return a;
  }
  return b;
}

int dem_lev_helper(char *S1, char *S2, int N, int M)
{
  int D1 = 0, D2 = 0, D3 = 0, D4 = 0,distance = 0;
  
  if( dem_lev_min(N,M) <= 0 ){
    return dem_lev_max(N,M);    
  }
  
  char AN = S1[N-1];
  char BM = S2[M-1];
  
  if( (N > 2) && (M > 2) ){
    
    char AN1 = S1[N-2];
    char BM1 = S2[M-2];
    
    if( (AN == BM1) && (AN1 == BM) ){
      D1 = dem_lev_helper(S1,S2,N-1,M) + 1;
      D2 = dem_lev_helper(S1,S2,N,M-1) + 1;
      D3 = dem_lev_helper(S1,S2,N-1,M-1);
      D4 = dem_lev_helper(S1,S2,N-2,M-2) + 1;
      
      if( AN != BM ){
        D3 += 1;
      }
      
      distance = dem_lev_min(D1,D2);
      distance = dem_lev_min(distance,D3);
      distance = dem_lev_min(distance,D4);
      
      return distance;
    }    
  }
  
  D1 = dem_lev_helper(S1,S2,N-1,M) + 1;
  D2 = dem_lev_helper(S1,S2,N,M-1) + 1;
  D3 = dem_lev_helper(S1,S2,N-1,M-1);
  
  if( AN != BM ){
        D3 += 1;
  }
  
  distance = dem_lev_min(D1,D2);
  distance = dem_lev_min(distance,D3);
  
  return distance;
  
}

Datum dem_lev_distance(PG_FUNCTION_ARGS)
{	
  text *arg1 = (text *)PG_GETARG_TEXT_P(0);
  text *arg2 = (text *)PG_GETARG_TEXT_P(1);
  char *S1 = (char *)VARDATA(arg1);
  char *S2 = (char *)VARDATA(arg2);  
  int N = VARSIZE(arg1) - VARHDRSZ;
  int M = VARSIZE(arg2) - VARHDRSZ;
  
  int p1 = dem_lev_helper(S1,S2,N,M);
  
  PG_RETURN_INT32(p1);
}
