package com.example.stw.myapplication;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class Main2Activity extends AppCompatActivity {
    ListView listView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        listView = (ListView) findViewById(R.id.listViewCustomers);
        //calling the method to display the customers
        getProduct();
    }
    private void getProduct() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(MyInterface.BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        MyInterface myInterface = retrofit.create(MyInterface.class);
        Call<List<Product>> call = myInterface.getProduct();
        call.enqueue(new Callback<List<Product>>() {
            @Override
            public void onResponse(Call<List<Product>> call, Response<List<Product>> response) {
                List<Product> productList = response.body();
                //Creating an String array for the ListView
                //looping through all the customers and inserting the names inside the string array
                List<Map<String, String>> data = new ArrayList<Map<String, String>>();

                for (int i = 0; i < productList.size(); i++) {
                    Map<String, String> datum = new HashMap<String, String>(2);
                    datum.put("title", productList.get(i).getName());
                    datum.put("date", productList.get(i).getPrice());
                    data.add(datum);
                }
                SimpleAdapter adapter = new SimpleAdapter(getApplicationContext(), data,
                        android.R.layout.simple_list_item_2,
                        new String[] {"title", "date"},
                        new int[] {android.R.id.text1,android.R.id.text2});

                //displaying the string array into listview
                listView.setAdapter(adapter);
            }
            @Override
            public void onFailure(Call<List<Product>> call, Throwable t) {
                Toast.makeText(getApplicationContext(),
                        t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
