import { Routes } from '@angular/router';
import { LoginComponent } from './pages/components/login/login.component';
import { CardsComponent } from './pages/components/cards/cards.component';
import { CardDetailsComponent } from './pages/components/card-details/card-details.component';
import { DeckComponent } from './pages/components/deck/deck.component';
import { LayoutComponent } from './pages/components/layout/layout.component';
import { authGuard } from './services/auth.guard';
import { GameComponent } from './pages/components/game/game.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'cards',
        component: CardsComponent,
      },
      {
        path: 'cards/:id',
        component: CardDetailsComponent,
      },
      {
        path: 'decks',
        component: DeckComponent,
      },
      {
        path: 'game',
        component: GameComponent,
      },
    ],
  },
];
