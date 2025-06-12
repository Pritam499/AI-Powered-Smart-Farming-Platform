import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="text-center py-20">
      <h1 class="text-4xl font-bold mb-6">Welcome to SmartFarm</h1>
      <a routerLink="/try" class="bg-green-600 text-white px-6 py-3 rounded">Try Now</a>
    </div>
  `
})
export class HomeComponent {}
