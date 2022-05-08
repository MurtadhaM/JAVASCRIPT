import java.util.*;

public class Member {

    private String firstName; //first name of member
    private String lastName; //last name of member
    private double moneySpent; //money spent of member

    public Member(String firstName, String lastName, double moneySpent) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.moneySpent = moneySpent;
    }

    public Member() {

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

    public void totalSpending(int numBooks, int numCds, int numDVD) {
        System.out.println("Total spending since becoming a member: $" + moneySpent);
    }

    public void addMoneySpent(double moneySpent) {
        this.moneySpent += moneySpent;
    }

    public void receipt(int numBooks, int numCds, int numDVD) {

        System.out.println("Number of books: $50 x " + numBooks + " = $" + (50 * numBooks));
        System.out.println("Number of cds:   $30 x " + numCds + " = $" + (30 * numCds));
        System.out.println("Number of dvds:  $15 x " + numDVD + " = $" + (15 * numDVD));

    }

}
