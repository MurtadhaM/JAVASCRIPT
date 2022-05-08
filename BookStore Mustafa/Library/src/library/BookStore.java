
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Scanner;
// The class where the main method resides and the code is executed

public class BookStore implements BookstoreSpecification {
     // THIS IS CREATED AS A PROOF OF CONCEPT BUT WILL NOT BE USED FOR NOW

     public static ArrayList<Product> Inventory = new ArrayList<Product>();
     // THIS IS CREATED AS A PROOF OF CONCEPT BUT WILL NOT BE USED FOR NOW
     public static ArrayList<PremiumMember> Member = new ArrayList<PremiumMember>();
     // AN OBJECT OF THE SCANNER CLASS TO TAKE THE USERS INPUT
     public static Scanner sc = new Scanner(System.in);
    
     // THIS IS CREATED AS A PROOF OF CONCEPT BUT WILL NOT BE USED FOR NOW BUT WILL INCLUDE THE CODE TO PROOF THAT I CAN DO IT
     private static void CreateInventory() {

         // Setting up the inventory
         // instantiating each product for inventory Feature/Function # 1
         //First parameter is the price and the second is the default inventory
         Product CD = new CD(15, 10);
         Product DVD = new DVD(8, 15);
         Product BOOK = new BOOK(10, 5);
         Inventory.add(CD);
         Inventory.add(DVD);
         Inventory.add(BOOK);
     }

     // A method that reads a csv file and stores the data in the inventory

     public static void importCSVFile() {
         String filename = "inventory.csv";
         // This is the line that reads the file and stores the data in the inventory
            // This will populate the inventory with the data from the csv file
            Inventory.addAll(CSVReader.readCSV(filename));  

     }   

    // Implement the methods in the interface
    @Override
    public int restockProduct(int productId, int quantity) {
        
        /*Product CD = Inventory.get(0);
        Product DVD = Inventory.get(1);
        Product BOOK = Inventory.get(2);
        */

        //CD
        if (productId == 0) {
            Inventory.get(0).setInventory(Inventory.get(0).getInventory() + quantity);

        }
        // DVD
        else if (productId == 1) {
        Inventory.get(1).setInventory(Inventory.get(1).getInventory() + quantity);
    } else if (productId == 2) {
          
        // BOOK
        Inventory.get(2).setInventory(Inventory.get(2).getInventory() + quantity);
      } else {
        System.out.println("Invalid product ID");
      }
      return 0;
    }

    @Override
    public double inventoryValue() {
        // we are always instock because we do drop shippments from China the motherland
        // for each product in Inventory we are adding the price of the product to the total
        double total = 0;
        for (Product product : Inventory) {
            total += product.getPrice();
        }
        return total;

    }



    /**
     * @param args
     */
    public static void main(String[] args) {
        System.out.println("Welcome to Amazing Library by Mustafa Ali!");
        CreateInventory();
        Product CD = Inventory.get(0);
        Product DVD = Inventory.get(1);
        Product BOOK = Inventory.get(2);
        String IsPremium = "";
        String productChoice = "";
        // Printing the inventory for the user Feature/Function #2

        System.out.println("Current Inventory is: " + DVD.getInventory() + " DVDs");
        System.out.println("Current Inventory is: " + CD.getInventory() + " CDs");
        System.out.println("Current Inventory is: " + BOOK.getInventory() + " Books");

        /// Getting the user name and saving under a new Member
        System.out.println("are you a new Member? Y/N");
        // Storing the variable decide if the member is a premioum or rereguiler
        boolean isExit = false;
        IsPremium = sc.nextLine();
        Member currentMember = new Member();
        // This is time for reflection: I used contains instead of == char or String because I had better results than casting the variable and I don't want to
        // Do a try catch block or deal with EXCEPTIONS
        if (IsPremium.contains("Y")) {
            // THIS IS THE CONSTRUCTOR TO FOLOW  public PremiumMember(String fName, String lName, double amountSpent, String payMethod)
            System.out.println("Type your first name");
            String fname = sc.nextLine();
            System.out.println("Type your last name");
            String lname = sc.nextLine();
            // Making an instance of the Member class with child Premium Member
            Member newMember = new PremiumMember(fname, lname, 0.00, "Cash");
            currentMember = newMember;
        } else if (IsPremium.contains("N")) {
            // THIS IS THE CONSTRUCTOR TO FOLOW  public RegularMember(String firstName, String lastName, double moneySpent)
            System.out.println("Type your first name");
            String fname = sc.nextLine();
            System.out.println("Type your last name");
            String lname = sc.nextLine();
            // Making an instance of the Member class with child Regular Member
            Member newMember = new RegularMember(fname, lname, 0.00);
            currentMember = newMember;
            System.out.println("Welcome! " + newMember.getFirstName() + " " + newMember.getLastName());

        }
        int numCD = 0;
        int numDVD = 0;
        int numBOOK = 0;
        while (!isExit) {   // Prompting the user for selection
            System.out.println("Select an Item from the following \nA. For book \nB. for CD\nC. For DVD\nI. for Comapring Product.\nZ  for adding a new product\nS. to Checkout \nQ. to Exit");
            // Taking the user's input and storing it in a variable for later processing
            productChoice = sc.nextLine();

            // For Debugging and Proof of Concept for the TA
            System.out.println("The user choice is: " + productChoice);

            // BOOK
            if (productChoice.contains("A")) {
                // Removing one from Inventorys
                BOOK.subtractInventory(1);
                // incrementing the quantity
                numBOOK++;

                // CD
            } else if (productChoice.contains("B")) {
                // Removing one from Inventorys
                CD.subtractInventory(1);
                // incrementing the quantity
                numCD++;

            } else if (productChoice.contains("C")) {
                // Removing one from Inventorys
                DVD.subtractInventory(1);
                // incrementing the quantity
                numDVD++;

            } else if (productChoice.contains("Q")) {
                isExit = true;
            } // New Test Harness functionality
            else if (productChoice.contains("I")) {
                System.out.println("The total amount of all the products is: " );
                // Using the compareTo method to compare the prices of the products
                Inventory.sort(Comparator.comparing(Product::getPrice));

                System.out.println("The highest priced product is: " + Inventory.get(Inventory.size() - 1).getName());

            } else if (productChoice.contains("Z")) {
                // This will run when the user presses Z to add products
                System.out.println("\nPress 0 for CD \nPress 1 for DVD \nPress 2 for Book");
                String productType = sc.nextLine();
                int  quantity = 0; 
                if (!productType.isEmpty() || productType.length() > 0) {
                    System.out.println("How many products do you want to add?");
                    quantity = sc.nextInt();

                } else {
                    System.out.println("Invalid product type");
                }
                
                if (productType.contains("0")) {
                    
                    // Removing one from Inventorys
                    CD.addInventory(quantity);
                    // incrementing the quantity
                    numCD += quantity;
                } else if (productType.contains("1")) {
                    // Removing one from Inventorys
                    DVD.addInventory(quantity);
                    // incrementing the quantity
                    numDVD += quantity;
                } else if (productType.contains("2")) {
                    // Removing one from Inventorys
                    BOOK.addInventory(quantity);
                    // incrementing the quantity
                    numBOOK += quantity;
                } else {
                    System.out.println("Invalid product ID");
                }
                System.out.println(" Adding was successful thanks bruh ");
            } else if (productChoice.contains("S")) {
                PrintReciept(((DVD.getPrice() * numDVD) + (CD.getPrice() * numCD) + (BOOK.getPrice() * numBOOK)), "Products", currentMember.getFirstName());
                isExit = true;
            } else {
                System.out.println("Invalid Choice!");
                // Exiting the program cause fraud is attemptedss

            }
            System.out.println("THank you for shopping at Mustafas Library where Shopping is a pleasure ");

            // Now we Print the reciept as a third Feature/Function
            // Assuming the user had paid we are printing the reciept
            // Printing the Inventory after the purchase
            System.out.println("Current Inventory is: " + DVD.getInventory() + " DVDs");
            System.out.println("Current Inventory is: " + CD.getInventory() + " CDs");
            System.out.println("Current Inventory is: " + BOOK.getInventory() + " Books");
        }
    }

    /**
     * @param price
     * @param productName
     * @param name
     */
    // A SIMPLE VOID METHOD TO PRINT THE RECIEPT --NEEDS TO BE STATIC TO BE USED IN MAIN METHOD
    public static void PrintReciept(double price, String productName, String name) {

        // Printing a simple reciept
        System.out.println("You were charged $" + price + " dollars for " + productName + " " + name);
    }

}
