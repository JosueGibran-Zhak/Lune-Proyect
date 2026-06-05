import { Component, input} from '@angular/core';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { NavButton } from '../../shared/components/nav-button/nav-button';

export type NavbarMode = 'chat' | 'marketplace';

@Component({
  selector: 'app-nav-bar',
  standalone:true,
  imports: [SearchBar, NavButton],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  //Por defecto está en el modo chat
  mode = input<NavbarMode>('chat');
}
