#include <stdio.h>

int main(int argc, char *argv[]){
    int a[2][2] = {{11,22},{44,55}};
    int i, sum = 0;
    int *p;
    p= a[0];
    for(i=1 ; i <4 ; i++)
    sum += *(p+i);
    printf("%d", sum);
    return 0;
}