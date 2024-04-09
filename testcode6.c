#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main (int argc, char *argv[]) {
    char str1[20] = "KOREA";
    char str2[20] = "LOVE" ;
    char * p1=NULL;
    char * p2=NULL;
    p1= str1;
    p2= str2;
    str1[1] = p2[2];
    str2[3] = p1[4];
    strcat(str1, str2);
    printf("%c", *(p1 + 2));
    return 0;
}