import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <nav class="bg-green-600 text-white p-4">
      <a routerLink="" class="font-bold mr-4">SmartFarm</a>
      <a routerLink="/try" class="mr-4">Try</a>
      <a routerLink="/dashboard">Dashboard</a>
    </nav>
  `
})
export class NavbarComponent {}
