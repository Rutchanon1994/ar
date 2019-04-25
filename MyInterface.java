package com.example.stw.myapplication;
import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;

public interface MyInterface {
    String BASE_URL = "http://10.0.2.2/";
    @GET("android/get_all_products.php")
    Call<List<Product>> getProduct();


}
