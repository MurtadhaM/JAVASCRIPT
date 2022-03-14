


public class Book extends Product{
private String ISBN;


public Book(int pID, String bISBN, int noOfProduct) {

super(pID, noOfProduct);

this.ISBN = bISBN;

}

public String getISBN() {

return ISBN;

}

public void setISBN(String iSBN) {

ISBN = iSBN;

}

}


