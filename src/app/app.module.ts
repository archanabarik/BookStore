import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { ApiService } from './api.service';
import { AuthService } from './auth/auth.service';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from './profile/profile.component';


import { ShopItemListComponent } from './shop/shop-item-list/shop-item-list.component';
import { ShopItemDetailComponent } from './shop/shop-item-detail/shop-item-detail.component';
import { ItemCartComponent } from './cart/cart-item-list.component';
import { FormComponent } from './shop/shop-item-form/shop-item-form.component';
import { ShopItemFilterPipe } from './shop/shop-item-list//shop-item-filter.pipe';

import { CartService } from './shared/cart.service';
import { ShopService } from './shared/shop.service';
import { AppErrorHandler } from './error/app-error-handler';

import { CalendarModule, RatingModule } from 'primeng/primeng';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CallbackComponent,
    ProfileComponent,
    ShopItemListComponent, 
    ShopItemDetailComponent, 
    ItemCartComponent, 
    ShopItemFilterPipe,
    FormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpModule,
    CalendarModule,
    RatingModule
  ],
  providers: [
    ApiService,
    AuthService,
    CartService,
    Title,
    ShopService,
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
title = "BookStore"
}
