

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

public class PremiumMember extends Member {

    private String payMethod;

    public PremiumMember(String fName, String lName, double amountSpent, String payMethod) {
        super(fName, lName, amountSpent);
        this.payMethod = payMethod;
    }

    public PremiumMember() {

    }


    /**
     * @return String
     */
    public String getPayMethod() {
        return payMethod;
    }


    /**
     * @param payMethod
     */
    public void setPayMethod(String payMethod) {
        this.payMethod = payMethod;
    }


    /**
     * @param method
     */
    public void makePayment(int method) {

    }

}
