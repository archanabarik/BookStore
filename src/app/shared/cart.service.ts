import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { IShopItem } from './shop-item.interface';
import { ICartItem } from './cart-item.interface';
import { ICartService } from './cart-service.interface';

import { ICartItemDetailed } from './cart-item-detailed.interface';
import { AuthService } from '../auth/auth.service';
import { ShopService } from './shop.service';
import { AppError } from '../error/app-error';

@Injectable()
export class CartService implements ICartService {
    constructor(private http: Http, private shop: ShopService) {}

    getCartItems(): Observable<ICartItem[]> {
        return this.http.get('http://localhost:8080/cart?userId=' + AuthService.getUser())
            .map((response: Response) => <ICartItem[]>response.json())
            .catch(AppError.handle);
    }

    getCartItemsWithDetails(): Observable<ICartItemDetailed[]> {
        let detailedCartItems: ICartItemDetailed[] = [];

        return Observable.create(observer => {
            this.getCartItems().subscribe(
                cartItems => {
                    for (let cartItem of cartItems) {
                        this.shop.getShopItem(cartItem.itemId).subscribe(
                            shopItem => {
                                detailedCartItems.push(<ICartItemDetailed>{
                                    '_id': cartItem['_id'], // mongo db ref.
                                    'userId': cartItem.userId,
                                    'itemId': cartItem.itemId,
                                    'name': shopItem.name,
                                    'code': shopItem.code,
                                    'unitPrice': shopItem.unitPrice,
                                    'quantity': cartItem.quantity,
                                    'paid': cartItem.paid,
                                });
                            });
                    }
                    observer.next(detailedCartItems);
                    observer.complete();
                },
                error => console.log(error));
        });
    }

    addCartItem(item: IShopItem): Observable<ICartItem> {
        let body: any = {
            'userId': AuthService.getUser(),
            'itemId': item.id,
            'quantity': 1,
        };

        return this.http.post('http://localhost:8080/add', {add :JSON.stringify(body)})
            .map((response: Response) => response.json())
            .catch(AppError.handle);
    }

    addOrUpdateCartItem(item: IShopItem, callback): Observable<void> {
        return Observable.create(observer => {
            this.getCartItems().subscribe(
                cart => {
                    for (let cartItem of cart) {
                        if (cartItem['itemId'] === item['id']) {
                            this.increaseCartItemQunatity(cartItem).subscribe(
                                items => console.log('Incremented'),
                                error => console.log(error));
                            observer.next();
                            observer.complete();
                            return;
                        }
                    }
                    callback(this, item);
                    observer.next();
                    observer.complete();
                },
                error => console.log(error));
        });
    }

    removeCartItem(cartItem: ICartItem): Observable<ICartItem> {
        
        return this.http.post('http://localhost:8080/remove', {remove: JSON.stringify(cartItem)})
            .map((response: Response) => response.json())
            .catch(AppError.handle);
    }

    increaseCartItemQunatity(cartItem: ICartItem): Observable<ICartItem> {
        cartItem.quantity = cartItem.quantity + 1;
        return this.http.post('http://localhost:8080/revise',{revise: JSON.stringify(cartItem)})
            .map((response: Response) => response.json())
            .catch(AppError.handle);
    }

    decreaseCartItemQunatity(cartItem: ICartItem): Observable<ICartItem> {
        cartItem.quantity = cartItem.quantity - 1;
        return this.http.post('http://localhost:8080/revise',{revise: JSON.stringify(cartItem)})
            .map((response: Response) => response.json())
            .catch(AppError.handle);
    }

    checkOut(): void {} // TODO: for later implementation
}
