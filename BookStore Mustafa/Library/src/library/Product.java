

/*
@Author: Mustafa Ali
@Describtion: This program will simulate a simple library application whre the 3 features are:
1. Creating an inventory
2. Membership check
3. Checking out with both updating the inventory and printing the reciept
@Date: 23-02-2020


                    LET US BEGIN WITH THE MAIN METHOD

 */



public class Product implements Comparable<Product> {

    private int price;
    private String name;
    private int inventory;
    private int total;
    int  dvdPrice = 18;
    int BookPrice = 12;
    int cdPrice = 9;

    @Override
    public int compareTo(Product product) {
       if (this.price > product.price) {
           return 1;
       } else if (this.price < product.price) {
           return -1;
       } else {
           return 0;
       }
    }

    public Product(int price, int inventory) {
        this.price = price;
        this.inventory = inventory;
    }

    public Product(int price, int inventory, String name) {
        this.price = price;
        this.inventory = inventory;
        this.name = name;
    }
    

    public String getName() {
        return this.name;
    }
    public void setName(String name) {
        this.name = name;
    }

    

    public Product() {

    }


    /**
     * @return int
     */
    public int getPrice() {
        return price;
    }


    /**
     * @return int
     */
    public int getInventory() {
        return inventory;
    }


    /**
     * @param numBooks
     * @param numCds
     * @param numDvds
     * @return int
     */
    public int getTotal(int numBooks, int numCds, int numDvds) {
        this.total = (BookPrice * numBooks) + (cdPrice * numCds) + (dvdPrice * numDvds);
        return total;
    }

    /**
     * @param price
     */
    public void setPrice(int price) {
        this.price = price;
    }


    /**
     * @param inventory
     */
    public void setInventory(int inventory) {
        this.inventory = inventory;
    }


    /**
     * @param sold
     */
    public void subtractInventory(int sold) {
        this.inventory = this.inventory - sold;
    }


    /**
     * @param add
     */
    public void addInventory(int add) {
        this.inventory = this.inventory + add;
    }


    /**
     * @param numBooks
     * @param numCds
     * @param numDvds
     */
    public void setTotal(int numBooks, int numCds, int numDvds) {
        this.total = (BookPrice * numBooks) + (cdPrice * numCds) + (dvdPrice * numDvds);
    }

}
