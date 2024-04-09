#include <stdio.h>
#include <stdlib.h>

int main() {
    int a = 1, b = 2;

    if (a < b + 2 && a << 1 <= b) {
        printf("a,b\n");
    } else {
        printf("조건이 거짓입니다.\n");
    }

    return 0;
}
