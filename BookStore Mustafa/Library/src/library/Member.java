
/*
@Author: Mustafa Ali
@Describtion: This program will simulate a simple library application whre the 3 features are:
1. Creating an inventory
2. Membership check
3. Checking out with both updating the inventory and printing the reciept
@Date: 23-02-2020


                    LET US BEGIN WITH THE MAIN METHOD

 */
 import java.util.*;

public class Member {

    private String fName;
    private String lName;
    private double moneySpent;

    public Member(String firstName, String lastName, double amountSpent) {
        this.fName = firstName;
        this.lName = lastName;
        this.moneySpent = amountSpent;
    }

    public Member() {

    }


    /**
     * @return String
     */
    public String getFirstName() {
        return fName;
    }


    /**
     * @return String
     */
    public String getLastName() {
        return lName;
    }


    /**
     * @return double
     */
    public double getMoneySpent() {
        return moneySpent;
    }


    /**
     * @param firstName
     */
    public void setFirstName(String firstName) {
        this.fName = firstName;
    }


    /**
     * @param lastName
     */
    public void setLastName(String lastName) {
        this.lName = lastName;
    }


    /**
     * @param moneySpent
     */
    public void setMoneySpent(double moneySpent) {
        this.moneySpent = moneySpent;
    }


    /**
     * @param numBooks
     * @param numCds
     * @param numDVD
     */
    public void totalSpending(int numBooks, int numCds, int numDVD) {
        System.out.println("Total spending: $" + moneySpent);
    }


    /**
     * @param moneySpent
     */
    public void addMoneySpent(double moneySpent) {
        this.moneySpent += moneySpent;
    }


    /**
     * @param numBooks
     * @param numCds
     * @param numDVD
     */
    public void receipt(int numBooks, int numCds, int numDVD) {

        System.out.println("Number of books: $50 x " + numBooks + " = $" + (50 * numBooks));
        System.out.println("Number of cds:   $30 x " + numCds + " = $" + (30 * numCds));
        System.out.println("Number of dvds:  $15 x " + numDVD + " = $" + (15 * numDVD));

    }

}
