import { Component } from '@angular/core';
import { NavBar } from "../../../../layout/nav-bar/nav-bar";
import { MarketplaceBody } from '../../../../layout/marketplace-body/marketplace-body';

@Component({
  selector: 'app-marketplace-page',
  imports: [NavBar,MarketplaceBody],
  template: ` 
  
  <div class="page">
    <app-nav-bar mode="marketplace"></app-nav-bar>
    <app-marketplace-body></app-marketplace-body>
  </div>
  
  `,
  styleUrl: './marketplace-page.scss',
})
export class MarketplacePage {}
