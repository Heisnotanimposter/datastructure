#include <stdio.h>

int main(void) {
    int n = 4;
    int* pt = NULL;
    pt = &n;

    printf("%d", &n + *pt - *&pt + n);
    return 0;
}