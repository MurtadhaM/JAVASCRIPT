import java.util.ArrayList;

import java.util.Scanner;

public class Store {
    

public static ArrayList<Product> inventory = new ArrayList<Product>();

public static ArrayList<PremiumMember> members = new ArrayList<PremiumMember>();

public static Scanner sc = new Scanner(System.in);

private static void CreateInventory() {

// TODO Auto-generated method stub

int pID, noOfProduct;

String isBook, bISBN;

Book book;

CD cd;

System.out.println("Press Y\'y if you want to store book in inventory");

System.out.println("Press N\'n if you want to store CD in inventory");

isBook = sc.next();

while(true){

System.out.println("Plese enter product id");

pID = sc.nextInt();

System.out.println("Plese enter number of product");

noOfProduct = sc.nextInt();

if(isBook.equalsIgnoreCase("Y")){

System.out.println("Plese enter book isbn number");

bISBN = sc.next();

book = new Book(pID, bISBN, noOfProduct);

inventory.add(book);

}else if(isBook.equalsIgnoreCase("N")){

cd = new CD(pID, noOfProduct);

inventory.add(cd);

}

System.out.println("Press Y if you want to add another item in inventory");

char ch = sc.next().charAt(0);

if(ch != 'Y' || ch != 'y')

break;

}

}

private static void DistributeItem() {


System.out.println("Enter product id to issue");

int pID = sc.nextInt();

int pCount;

String premium = null,paymentMethod = null;

double fee = 0;

PremiumMember member;

if(findProduct(pID)){

System.out.println("Enter number of item you want");

pCount = sc.nextInt();

if(CheckInventory(pID, pCount)){

System.out.println("Plese enter Member ID");

int id = sc.nextInt();

System.out.println("Plese enter Member first Name");

String fName = sc.next();

System.out.println("Plese enter Member last Name");

String lName = sc.next();

System.out.println("Press Y\'y if you member is Premium");

member = new PremiumMember(id,fName, lName);

if(premium.equalsIgnoreCase("Y")){

System.out.println("Enter monthly fee and payment method");

member.setFeeMonthly(fee);

member.setPaymentMethod(paymentMethod);

}

members.add(member);

}

}else{

System.out.println("Item not found");

}

}

private static boolean CheckInventory(int pID, int pCount) {


for(Product p:inventory){

if(p.getProductID() == pID){

if(p.getCount() >= pCount){

p.setCount(p.getCount() - pCount);

return true;

}

}

}

return false;

}

private static boolean findProduct(int pID) {


for(Product p:inventory){

if(p.getProductID() == pID)

return true;

}

return false;

}

public static void main(String[] args) {

//Create array of product class

CreateInventory();

while(true){

//distribute item from inventory

DistributeItem();

String check;

System.out.println("Do you want to distribute more items press Y");

check = sc.next();

if(!check.equalsIgnoreCase("Y")){

break;

}

}

}

}