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

  formatImageUrl(url: string): string {
    if (!url) return url;
    const targetBase = 'https://res.cloudinary.com/homely-cloudinary/image/upload/';
    if (url.startsWith(targetBase) && !url.includes('homely/properties/')) {
      const pathPart = url.substring(targetBase.length);
      const match = pathPart.match(/^(v\d+\/)?(.+)$/);
      if (match) {
        const version = match[1] || '';
        const filename = match[2];
        return `${targetBase}${version}homely/properties/${filename}`;
      }
    }
    return url;
  }

  @Input()
  set properties(val: any[] | null) {
    if (val && val.length > 0) {
      this._properties = val.map(prop => {
        let mappedImages = prop.images;
        if (prop.images && prop.images.length > 0) {
          mappedImages = prop.images.map((img: any) => ({
            ...img,
            imageUrl: this.formatImageUrl(img.imageUrl)
          }));
        }

        let mainImg = '/assets/img/house-placeholder.jpg';
        if (mappedImages && mappedImages.length > 0) {
          const sortedImgs = [...mappedImages].sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
          mainImg = sortedImgs[0]?.imageUrl || mainImg;
        } else if (prop.imageUrl) {
          mainImg = this.formatImageUrl(prop.imageUrl);
        }
        return {
          ...prop,
          images: mappedImages,
          imageUrl: prop.imageUrl ? this.formatImageUrl(prop.imageUrl) : prop.imageUrl,
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
