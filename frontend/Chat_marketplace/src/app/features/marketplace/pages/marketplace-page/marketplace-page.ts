import { Component } from '@angular/core';
import { NavBar } from "../../../../layout/nav-bar/nav-bar";

@Component({
  selector: 'app-marketplace-page',
  imports: [NavBar],
  template: ` 
  
  <div class="page">
    <app-nav-bar mode="marketplace"></app-nav-bar>
  </div>
  
  `,
  styleUrl: './marketplace-page.scss',
})
export class MarketplacePage {}
