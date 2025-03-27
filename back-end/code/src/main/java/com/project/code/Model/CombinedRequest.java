package com.project.code.Model;

public class CombinedRequest {
    
    private Product product;
    private Inventory inventory;

    public Product getProduct() {
        return product;
    }

    // Setter for product
    public void setProduct(Product product) {
        this.product = product;
    }

    // Getter for store
    public Inventory getInventory() {
        return inventory;
    }

    // Setter for store
    public void setInventory(Inventory inventory) {
        this.inventory = inventory;
    }
}