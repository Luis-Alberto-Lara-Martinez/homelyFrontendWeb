import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyChooseUsComponent } from '../../components/why-choose-us/why-choose-us.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, WhyChooseUsComponent],
  templateUrl: './about.component.html'
})
export class AboutComponent {}
