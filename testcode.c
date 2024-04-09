#include <stdio.h>
struct st{
        int a;
        int c [10];

};

int main (int argc, char * argv[]){
        int i = 0   ;
        struct st ob1   ;
        struct st ob2   ;
        ob1.a = 0 ; 
        ob2.a = 0 ; 

        for(i = 0 ; i<10 ; i ++){
                    ob1.c[i] = i ; 
                    ob2.c[i] = ob1.c[i] + i ;
        }

        for(i = 0; i<10; i = i +2){
                    ob1.a = ob1.a + ob1.c[i] ; 
                    ob2.a = ob2.a + ob2.c[i] ;

        }

        printf("%d", ob1.a + ob2.a) ;
        return 0 ;
}