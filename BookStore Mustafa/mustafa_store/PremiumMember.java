
public class PremiumMember extends Member {

public PremiumMember(int id, String fName, String lName) {

super(id, fName, lName);


}

private double feeMonthly;

private String paymentMethod;

private boolean feePaidOnTime;

public double getFeeMonthly() {

return feeMonthly;

}

public void setFeeMonthly(double feeMonthly) {

this.feeMonthly = feeMonthly;

}

public String getPaymentMethod() {

return paymentMethod;

}

public void setPaymentMethod(String paymentMethod) {

this.paymentMethod = paymentMethod;

}

public boolean isFeePaidOnTime() {

return feePaidOnTime;

}

public void setFeePaidOnTime(boolean feePaidOnTime) {

this.feePaidOnTime = feePaidOnTime;

}

}