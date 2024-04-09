//2245051 이승원 DataStructure p409 predict tree algorithm

#include <stdio.h>
#include <stdlib.h>

struct Node {
    int value;
    struct Node** children;
    int numChildren;
};

struct Node* createNode(int value) {
    struct Node* node = (struct Node*)malloc(sizeof(struct Node));
    node->value = value;
    node->children = NULL;
    node->numChildren = 0;
    return node;
}

void addChild(struct Node* parent, struct Node* child) {
    parent->numChildren++;
    parent->children = (struct Node**)realloc(parent->children, sizeof(struct Node*) * parent->numChildren);
    parent->children[parent->numChildren - 1] = child;
}

void removeBranches(struct Node* node, int* removedBranches, int numRemovedBranches) {
    if (node == NULL)
        return;

    int i, j;
    for (i = 0; i < numRemovedBranches; i++) {
        if (node->value == removedBranches[i]) {
            for (j = 0; j < node->numChildren; j++) {
                free(node->children[j]);
            }
            free(node->children);
            node->children = NULL;
            node->numChildren = 0;
            return;
        }
    }

    for (i = 0; i < node->numChildren; i++) {
        removeBranches(node->children[i], removedBranches, numRemovedBranches);
    }
}

int findPredictedLocation(struct Node* node, int jumps) {
    if (jumps == 0 || node == NULL)
        return node->value;

    if (node->numChildren == 0)
        return node->value;

    struct Node* nextNode = node->children[jumps % node->numChildren];
    return findPredictedLocation(nextNode, jumps - 1);
}

int main() {
    int n, k;
    scanf("%d %d", &n, &k);

    // 나무의 가지 정보
    struct Node* root = createNode(1);
    struct Node* node2 = createNode(2);
    struct Node* node3 = createNode(3);
    struct Node* node4 = createNode(4);

    addChild(root, node2);
    addChild(root, node3);
    addChild(node2, node4);

    int removedBranches[] = {8, 9, 12, 13, 14};
    int numRemovedBranches = sizeof(removedBranches) / sizeof(removedBranches[0]);

    removeBranches(root, removedBranches, numRemovedBranches);

    int jumps = k;
    int predictedLocation = findPredictedLocation(root, jumps);

    printf("고양이가 있을 것으로 예측되는 위치: %d\n", predictedLocation);

    return 0;
}