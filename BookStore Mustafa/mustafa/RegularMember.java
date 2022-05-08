import java.util.*;

public class RegularMember {

    private String firstName; //first name of member
    private String lastName; //last name of member
    private double moneySpent; //money spent of member

    public RegularMember(String firstName, String lastName, double moneySpent) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.moneySpent = moneySpent;
    }

    public RegularMember() {

    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public double getMoneySpent() {
        return moneySpent;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setMoneySpent(double moneySpent) {
        this.moneySpent = moneySpent;
    }

    public void totalSpending(int numBooks, int numCds, int numDvds) {
        System.out.println("Total spending since becoming a member: $" + moneySpent);
    }

    public void addMoneySpent(double moneySpent) {
        this.moneySpent += moneySpent;
    }

    public void receipt(int numBooks, int numCds, int numDvds) {

        System.out.println("Number of books: $12 x " + numBooks + " = $" + (12 * numBooks));
        System.out.println("Number of cds:   $9 x " + numCds + " = $" + (9 * numCds));
        System.out.println("Number of dvds:  $18 x " + numDvds + " = $" + (18 * numDvds));
        System.out.println("---------------------------------");

    }

}
