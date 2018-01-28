import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';

import { IShopItem } from './shop-item.interface';
import { IShopItemReview } from './shop-item-review.interface';
import { IShopService } from './shop-service.interface';
import { AppError } from '../error/app-error';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ShopService implements IShopService {
    constructor(private http: Http) {}

    getShopItems(): Observable<IShopItem[]> {
        return this.http.get('http://localhost:8080/items')
            .map((response: Response) => <IShopItem[]>response.json())
            .catch(AppError.handle);
    }

    getShopItem(id: number): Observable<IShopItem> {
        return this.http.get('http://localhost:8080/item?id=' + id)
            .map((response: Response) => <IShopItem>response.json())
            .catch(AppError.handle);
    }

    addShopItem(body: any): Observable<IShopItem> {
        return this.http.post('http://localhost:8080/insert', {insert : JSON.stringify(body)})
            .map((response: Response) => response.json())
            .catch(AppError.handle);
    }

    updateShopItem(body: any): Observable<IShopItem> {
        return this.http.post('http://localhost:8080/update', {update : JSON.stringify(body)})
            .map((response: Response) => response.json())
            .catch(AppError.handle);
    }

    getShopItemReviews(itemId: number): Observable<IShopItemReview[]> {
        return this.http.get('http://localhost:8080/review?itemId=' + itemId)
            .map((response: Response) => <IShopItemReview[]>response.json())
            .catch(AppError.handle);
    }

    getShopItemReviewsCount(itemId: number): Observable<number> {
        return this.http.get('http://localhost:8080/reviewcount?itemId=' + itemId)
            .map((response: Response) => <number>response.json())
            .catch(AppError.handle);
    }

    getShopItemsRating(): Observable<any> {
        return this.http.get('http://localhost:8080/ratings')
            .map((response: Response) => <number>response.json())
            .catch(AppError.handle);
    }

    setShopItemReview(itemId: number,reviewDate: Date, remarks: string, rating: number): Observable<IShopItemReview> {
        let body: any = {
            'itemId': itemId.toString(),
            'userId': AuthService.getUser(), // AuthService.getUser(),
            'reviewDate': reviewDate,
            'remarks': remarks,
            'rating': rating
        };

        return this.http.post('http://localhost:8080/addreview', {review : JSON.stringify(body)})
            .map((response: Response) => response.json())
            .catch(AppError.handle);
    }
}
