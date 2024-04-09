#include <stdio.h>
#include <stdlib.h>
int main (int argc, char *argv[]) {
    int i = 0;
    while(1){
        if(i==4){
            break;
        }
        ++i;
    }
    printf("i = %d", i) ; 
    return 0; 
}
