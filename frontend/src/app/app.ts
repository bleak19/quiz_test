import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <--- ADD THIS

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet], // <--- ADD THIS to the imports array
  template:
  ` 
    <main>
      <router-outlet></router-outlet> 
    </main>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  title = 'default';
}