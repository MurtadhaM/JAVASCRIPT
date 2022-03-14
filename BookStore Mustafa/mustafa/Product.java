
package mustafa;


public class Product {

    private int price; 
    private int inventory; 
    private int total; 

    public Product(int price, int inventory) {
        this.price = price;
        this.inventory = inventory;
    }

    public Product() {

    }

    public int getPrice() {
        return price;
    }

    public int getInventory() {
        return inventory;
    }

    public int getTotal(int numBooks, int numCds, int numDvds) {
        this.total = (12 * numBooks) + (9 * numCds) + (18 * numDvds);
        return total;
    }
    public void setPrice(int price) {
        this.price = price;
    }

    public void setInventory(int inventory) {
        this.inventory = inventory;
    }

    public void subtractInventory(int sold) {
        this.inventory = this.inventory - sold;
    }

    public void addInventory(int add) {
        this.inventory = this.inventory + add;
    }

    public void setTotal(int numBooks, int numCds, int numDvds) {
        this.total = (12 * numBooks) + (9 * numCds) + (18 * numDvds);
    }

}
