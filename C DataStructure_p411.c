//2245051 이승원 DataStructure p411 decision tree algorithm

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    char question[100];
    struct Node* yes;
    struct Node* no;
} Node;

Node* createNode(const char* question, Node* yes, Node* no) {
    Node* node = (Node*)malloc(sizeof(Node));
    strcpy(node->question, question);
    node->yes = yes;
    node->no = no;
    return node;
}

void predict(Node* root) {
    if (root == NULL) {
        // Handle error case
        return;
    }

    if (root->yes == NULL && root->no == NULL) {
        printf("%s\n", root->question);
        return;
    }

    printf("%s (T/F): ", root->question);

    char answer;
    scanf(" %c", &answer);

    if (answer == 'T' && root->yes != NULL) {
        predict(root->yes);
    } else if (answer == 'F' && root->no != NULL) {
        predict(root->no);
    } else {
        printf("Invalid input!\n");
    }
}

int main() {
    // Create the decision tree
    Node* wingsNode = createNode("날개가 있나요?", NULL, NULL);
    Node* flyNode = createNode("날 수  있나요?", NULL, NULL);
    Node* furNode = createNode("털이 있나요??", NULL, NULL);
    Node* maggieNode = createNode("까치입니다!", NULL, NULL);
    Node* penguinNode = createNode("펭귄입니다!", NULL, NULL);
    Node* fastNode = createNode("빠르게 달리나요?", NULL, NULL);
    Node* frogNode = createNode("개구리입니다!", NULL, NULL);

    wingsNode->yes = flyNode;
    wingsNode->no = furNode;
    flyNode->yes = maggieNode;
    flyNode->no = penguinNode;
    furNode->yes = fastNode;
    furNode->no = frogNode;

    // Test the decision tree
     predict(wingsNode);

    // Clean up memory
     free(frogNode);
     free(fastNode);
     free(penguinNode);
     free(maggieNode);
     free(furNode);
     free(flyNode);
     free(wingsNode);

    return 0;
}