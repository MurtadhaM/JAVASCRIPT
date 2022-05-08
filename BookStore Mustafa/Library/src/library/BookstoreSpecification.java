/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Mustafa Ali
 */
public interface BookstoreSpecification {
/**
 * given a product id and a product quantity, update
 * stock by adding amount to existing product quantity
 *
 * @param productId
 * @param amount
 * @return
 */
    public int restockProduct (int productId, int amount);

    /**
     * calculate and return dollar amount for current inventory of products
     * that is in stock
     *
     * @return total in stock value
     */
    public double inventoryValue();
}

