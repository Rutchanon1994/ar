/*
* Copyright 2015 The Android Open Source Project
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

package com.example.stw.myapplication;

import android.Manifest;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Toast;

import com.wikitude.architect.ArchitectView;
import com.wikitude.common.permission.PermissionManager;


import java.util.Arrays;


public class MainActivity extends AppCompatActivity
        implements ActivityCompat.OnRequestPermissionsResultCallback {

    private static final int PERMISSION_REQUEST_CAMERA = 0;
    private final PermissionManager permissionManager = ArchitectView.getPermissionManager();
    private View mLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mLayout = findViewById(R.id.main_layout);
        findViewById(R.id.button_open_camera).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {// showCameraPreview();
                final String[] permissions =  new String[]{Manifest.permission.CAMERA, Manifest.permission.ACCESS_FINE_LOCATION};
                permissionManager.checkPermissions(MainActivity.this, permissions, PermissionManager.WIKITUDE_PERMISSION_REQUEST, new PermissionManager.PermissionManagerCallback() {
                    @Override
                    public void permissionsGranted(int requestCode) {
                        Intent intent = new Intent(MainActivity.this, SimpleGeoArActivity.class);
                        startActivity(intent);
                    }

                    @Override
                    public void permissionsDenied(@NonNull String[] deniedPermissions) {
                        Toast.makeText(MainActivity.this, getString(R.string.permissions_denied) + Arrays.toString(deniedPermissions), Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void showPermissionRationale(final int requestCode, @NonNull String[] strings) {
                        final AlertDialog.Builder alertBuilder = new AlertDialog.Builder(MainActivity.this);
                        alertBuilder.setCancelable(true);
                        alertBuilder.setTitle(R.string.permission_rationale_title);
                        alertBuilder.setMessage(getString(R.string.permission_rationale_text) + Arrays.toString(permissions));
                        alertBuilder.setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                permissionManager.positiveRationaleResult(requestCode, permissions);
                            }
                        });

                        AlertDialog alert = alertBuilder.create();
                        alert.show();
                    }
                });
               // startCameraPOI();
            }
        });



    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        ArchitectView.getPermissionManager().onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
    private void startCameraPOI() {
        Intent intent = new Intent(this, SimpleGeoArActivity.class);
        startActivity(intent);
    }
}
