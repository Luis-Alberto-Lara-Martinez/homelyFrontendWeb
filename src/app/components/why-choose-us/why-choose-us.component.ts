import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './why-choose-us.component.html'
})
export class WhyChooseUsComponent {
  scrollToLeadership() {
    const element = document.getElementById('liderazgo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
