import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from './profile/profile.component';
import { ShopItemListComponent } from './shop/shop-item-list/shop-item-list.component';
import { ShopItemDetailComponent } from './shop/shop-item-detail/shop-item-detail.component';
import { ItemCartComponent } from './cart/cart-item-list.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: '',component: HomeComponent },
      {path: 'callback', component: CallbackComponent},
      { path: 'items', component: ShopItemListComponent },
      { path: 'items/:reload', component: ShopItemListComponent }, // workaround to re-init loaded component
      { path: 'item/:id', component: ShopItemDetailComponent },
      { path: 'cart/:customerId', component: ItemCartComponent },
      {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]} 
    ])
  ],
  providers: [
    AuthGuard
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
