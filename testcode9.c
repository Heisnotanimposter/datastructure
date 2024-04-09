#include <stdio.h>
#include <string.h>
int main(void) {
    char str[50] = "nation";
    char *p2 = "alter";
    strcat(str,p2);
    printf("%s", str);
    return 0;
}