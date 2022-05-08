public class StringAnalyser{

private static String validate (char expected, char result) {
    if (result != expected)
    return
    ("Expected " + expected + " but found " + result);
    else
   {
    return
    ("The result is false");
    }
    }
 
    public static void main(String[] args) {
    StringAnalyser sa = new StringAnalyser();
    System.out.println(sa.validate('a', 'a'));
    System.out.println(sa.validate('a', 'b'));
    
}
}