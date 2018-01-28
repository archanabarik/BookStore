import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {
    FormBuilder, FormGroup,
    FormControl,
    Validators
} from '@angular/forms';

import {
    ValidationService,
    ShopService
} from '../../shared/index';

import { ExtendedValidators } from './validators';
import { IShopItem } from '../../shared/shop-item.interface';

@Component({
    selector: 'shop-item-form',
    templateUrl: './shop-item-form.component.html',
    styleUrls: ['./shop-item-form.component.css'],
    providers: [ValidationService]
})
export class FormComponent implements OnInit {
    public shopItemForm: FormGroup;
    private isCreateForm = true;
    @Input() shopItem: IShopItem;
    @Output() shopItemsUpdated: EventEmitter<any> = new EventEmitter();

    constructor(
        private shop: ShopService,
        private validation: ValidationService,
        private formBuilder: FormBuilder) {}

    submitItem(form: any): void {
        if (form.valid) {
            let action: string = this.isCreateForm ? 'addShopItem' : 'updateShopItem';
            this.shop[action](form.value).subscribe(
                shopItem => { this.shopItemsUpdated.emit(null); },
            );
        } else {
            alert('Form Validation Failed! Please Re-Submit.');
        }
    }

    ngOnInit(): void {
        this.shopItemForm = this.formBuilder.group({
            'id': ['', Validators.required],
            'name': ['', Validators.compose(
                [Validators.required,
                    ExtendedValidators.nameValidator])],
            'code': ['', Validators.required],
            'unitPrice': ['', Validators.required],
            'quantityInStock': ['', Validators.required],
            'rating' : ['', Validators.required],
            'imageUrl' : [''],
            'releaseDate': [''],
            'description': ['']
        });

        if (this.shopItem) {
            this.isCreateForm = false;
            for (let key in this.shopItemForm.controls) {
                let value;
                if  (key === 'releaseDate') {
                    value = new Date(this.shopItem[key]);
                } else {
                    value = this.shopItem[key];
                }

                (this.shopItemForm.controls[key] as FormControl).setValue(value); // updateValue
            }
        }

        this.validation.configure(
            this.shopItemForm,
            {
                'name': {
                    'condition': 'invalidName',
                    'message': 'Name must start with albhabet or number'
                }
            },
            {}
        );
    }
}
