
public abstract class ComparableImplementation implements Comparable<Product> {

    int amount;
    int ProductId;

    ComparableImplementation(int amount, int ProductId) {
        this.amount = amount;
        this.ProductId = ProductId;

    }

    public int compareTo(ComparableImplementation st) {
        return -1;

    }
}
