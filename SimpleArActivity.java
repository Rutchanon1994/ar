package com.example.stw.myapplication;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;

import com.wikitude.architect.ArchitectStartupConfiguration;
import com.wikitude.architect.ArchitectView;
import com.wikitude.common.permission.PermissionManager;


public class SimpleArActivity extends AppCompatActivity {
    protected ArchitectView architectView;
    private final PermissionManager permissionManager = ArchitectView.getPermissionManager();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.simplear);
        WebView.setWebContentsDebuggingEnabled(true); //remote debugging
        architectView = (ArchitectView)this.findViewById( R.id.architectView );
        final ArchitectStartupConfiguration config = new ArchitectStartupConfiguration();
        config.setLicenseKey("YalSIBrdEVrBvv+MDEvxMQU6HIhl3SXrvUorhBZuE0mK4Il6hmeLIflN16MXRBRD7AtWkiWRpbSkRPog12ZWOgido+ipHPPHwTxVIpwq3wlTOSt/xBANh5MU0MA+1tCkWzmSrlalSjWyVoy8WzBM5suKWb1Q5IpCI3yDOl4cBl5TYWx0ZWRfXzp+B7OoVHvvi0XFQoXNK7XL076BKvbylD+gux+ckbPyEwsSF7gKDSB5vVzMNrsG/glTZKgRHPrnz/p3+YUVjdxM6IN2H/rJhcAoyzSTuH7MDgkQCJtV7Me5+c41yYxup6bEsJO3uMTzPoBfIcGL/RI8wEVCpFWeqj8a36kpSyokmy9kyDqrsQRqpvr1FS2sZbUQV8daGWFJfm84iOq1B7LB306hy3/GAYFEqTjHiS3KFbp/xtSqkwfLibcBYlfFCSX7walqbGoYuN9FN73s0Bz6MDlM751WZX9OkyOAjB8Q72Lkt1XlOr9sEnILYhHWU4gWC6X12DbFf3YZ/d/KWHPwZKlMHjYtme95bcLnRyi0/lvpRpyxLsekdLOqL/YAwbxCZ/ccn3q0GXbC+x5fq9k99Ou7oqwF879U84qrcAsNeJMPHFIU9ELEg2gzFaObmTo4LqoCk4MqRI6MX0mkxWRG37RM/sXdMUbJ+qBg24KT+yDWQzFnFkpO+V6SLhPe+J1ISDSVhqv1Pijj1aDYx/zTqVVBeDT5rSbLCXjmy39jt+y3NW2+cSrX1fm/5iTqFd/q+A6Ok7G2");
        architectView.onCreate( config );

    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        Log.e("resume","resume");

        architectView.onPostCreate();

       try {
           this.architectView.load("file:///android_asset/demo2/index.html");
       } catch (Exception e)
       {

       }
    }
    @Override
    protected void onResume() {
        super.onResume();
      architectView.onResume();
    }
    @Override
    protected void onDestroy() {
        super.onDestroy();
       architectView.onDestroy();

    }
    @Override
    protected void onPause() {
        super.onPause();
        architectView.onPause();

    }
}
