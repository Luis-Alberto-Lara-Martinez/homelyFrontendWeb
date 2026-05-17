import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-featured-properties',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-properties.component.html'
})
export class FeaturedPropertiesComponent {
  private _properties: any[] = [];

  defaultProperties: any[] = [
    {
      id: 1,
      title: 'Villa Moderna con Piscina',
      imageUrl: '/assets/img/house-1.jpg',
      status: 'En Venta',
      price: 1250000,
      location: 'Majadahonda, Madrid',
      beds: 4,
      baths: 3,
      sqft: 240
    },
    {
      id: 2,
      title: 'Ático con Vistas al Mar',
      imageUrl: '/assets/img/house-2.jpg',
      status: 'Alquiler',
      price: 2100,
      location: 'Diagonal Mar, Barcelona',
      beds: 2,
      baths: 2,
      sqft: 110
    },
    {
      id: 3,
      title: 'Chalet Adosado de Diseño',
      imageUrl: '/assets/img/house-3.jpg',
      status: 'En Venta',
      price: 450000,
      location: 'Rocafort, Valencia',
      beds: 3,
      baths: 2,
      sqft: 180
    }
  ];

  @Input()
  set properties(val: any[] | null) {
    if (val && val.length > 0) {
      this._properties = val.map(prop => {
        let mainImg = '/assets/img/house-placeholder.jpg';
        if (prop.images && prop.images.length > 0) {
          // Sort images ascending by displayOrder so the primary image (displayOrder: 1) is first
          const sortedImgs = [...prop.images].sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
          mainImg = sortedImgs[0]?.imageUrl || mainImg;
        } else if (prop.imageUrl) {
          mainImg = prop.imageUrl;
        }
        return {
          ...prop,
          mainImageUrl: mainImg
        };
      });
    } else {
      this._properties = this.defaultProperties.map(prop => ({
        ...prop,
        mainImageUrl: prop.imageUrl
      }));
    }
  }

  get properties(): any[] {
    return this._properties;
  }
}
