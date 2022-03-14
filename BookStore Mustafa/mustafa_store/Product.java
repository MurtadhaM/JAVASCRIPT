public class Product {

private int count;

private int productID;

public Product(int pID, int noOfProduct) {


this.productID=pID;

this.count = noOfProduct;

}

public int getProductID() {

return productID;

}

public void setProductID(int productID) {

this.productID = productID;

}

public int getCount() {

return count;

}

public void setCount(int count) {

this.count = count;

}

}