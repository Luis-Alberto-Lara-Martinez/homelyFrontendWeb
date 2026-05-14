import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mortgage-cta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mortgage-cta.component.html'
})
export class MortgageCtaComponent {}
