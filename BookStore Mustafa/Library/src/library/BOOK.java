
/*
@Author: Mustafa Ali
@Describtion: This program will simulate a simple library application whre the 3 features are:
1. Creating an inventory
2. Membership check
3. Checking out with both updating the inventory and printing the reciept
@Date: 23-02-2020


                    LET US BEGIN WITH THE MAIN METHOD

 */

 

public class BOOK extends Product {

    public BOOK(int price, int inventory) {
        super(price, inventory, "Book");

    }

    public BOOK() {

    }

}
