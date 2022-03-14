
package mustafa;
import java.util.*;

public class PremiumMember extends Member {

    private String payMethod; 

    public PremiumMember(String fName, String lName, double moneySpent, String payMethod) {
        super(fName, lName, moneySpent);
        this.payMethod = payMethod;
    }

    public PremiumMember() {

    }

    public String getPayMethod() {
        return payMethod;
    }

    public void setPayMethod(String payMethod) {
        this.payMethod = payMethod;
    }

    public void makePayment(int method) {

    }

}
