import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-button-demo',
    standalone: true,
    imports: [ButtonModule],
    template: `
    <div style="padding:20px">
      <p-button label="Check" />
    </div>
  `
})
export class ButtonDemoComponent { }
