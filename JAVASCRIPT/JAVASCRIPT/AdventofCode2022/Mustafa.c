#include <stdio.h>



int main(){

    printf("Hello World\n");
    printf("getting input from user\n");

    int a;
    scanf("%d Enter your age in years: ",&a);
    if (a >= 24){
        printf("You are able to drink legally!");
    }
    else if(a < 24){
        printf("You are not able to drink legally!");
    }

    return 0;
}