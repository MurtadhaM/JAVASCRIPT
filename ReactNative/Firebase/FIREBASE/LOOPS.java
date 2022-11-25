/*
 * 
 * Author: Murtadha Marzouq
 * @Description: This is a class that contains the methods that are used to loop 
 */
import java.util.*;

public class LOOPS {
    public static void main(String[] args) {

        // Advanced Loops in Java

        System.out.println("Advanced Loops in Java");
        List.of(1, 2, 3, 4).forEach(System.out::println);

        // #2 Enhanced For Loop
        System.out.println("Printing the size of the array");
        for (int i : List.of(1, 2, 3, 4)) {
            System.out.println("Printing 4 times");
        }
        // #3 LAMBDA NOTATION

        System.out.println("Doubling the numbers");
        List.of(1, 2, 3, 4).forEach((i) -> System.out.println(i * 2));

        // #4 COLLECTIONS
        System.out.println("Checking is the number is even");
        List.of(1, 2, 3, 4).forEach((value) -> isEven(value));
    }

    public static void isEven(int i) {
        System.out.println(i % 2 == 0);
    }
}
