
public class Member {

private int id;

private String firstName;

private String lastName;

private double moneySpent;

public Member(int id, String fName, String lName) {

// TODO Auto-generated constructor stub

this.id = id;

this.firstName = fName;

this.lastName = lName;

}

public int getId() {

return id;

}

public void setId(int id) {

this.id = id;

}

public String getFirstName() {

return firstName;

}

public void setFirstName(String firstName) {

this.firstName = firstName;

}

public String getLastName() {

return lastName;

}

public void setLastName(String lastName) {

this.lastName = lastName;

}

public double getMoneySpent() {

return moneySpent;

}

public void setMoneySpent(double moneySpent) {

this.moneySpent = moneySpent;

}

}