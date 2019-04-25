package com.example.stw.myapplication;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Product {
    @SerializedName("pid")
    @Expose
    private String pid;
    @SerializedName("name")
    @Expose
    private String name;
    @SerializedName("price")
    @Expose
    private String price;
    @SerializedName("description")
    @Expose
    private String description;
    public Product(String pid, String name, String price, String description) {
        this.pid = pid ;
        this.name = name;
        this.price = price;
        this.description = description;
    }
    public String getID() {
        return pid;
    }
    public void setId(String id) {
        this.pid = pid;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getPrice() {
        return price;
    }
    public void setPrice(String price) {
        this.price = price;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

}
