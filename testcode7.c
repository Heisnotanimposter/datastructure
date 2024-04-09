#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

void printList(struct Node* n) {
    while (n != NULL) {
        printf("%d ", n->data);
        n = n->next;
    }
}

int main() {
    struct Node* head = NULL;
    struct Node* second = NULL;
    struct Node* third = NULL;

    // allocate 3 nodes
    head = (struct Node*)malloc(sizeof(struct Node));
    second = (struct Node*)malloc(sizeof(struct Node));
    third = (struct Node*)malloc(sizeof(struct Node));

    head->data = 1; // assign first node
    head->next = second; // Link first node

    second->data = 2; // assign second node
    second->next = third; // Link second node

    third->data = 3; // assign third node
    third->next = NULL; // Link third node with NULL to indicate end of list

    printList(head);
    printList(second);
    printList(third);

    return 0;
}