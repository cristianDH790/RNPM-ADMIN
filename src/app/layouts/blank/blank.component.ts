import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-blank-layout',
  templateUrl: './blank.component.html',
  styleUrls: [],
  imports:[RouterOutlet],
  standalone: true
})
export class BlankComponent {}
