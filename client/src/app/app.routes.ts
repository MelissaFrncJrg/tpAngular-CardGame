import { Routes } from '@angular/router';
import { LoginComponent } from './pages/components/login/login.component';
import { LayoutComponent } from './pages/components/layout/layout.component';
import { DashboardComponent } from './pages/components/dashboard/dashboard.component';
import { CardsComponent } from './pages/components/cards/cards.component';
import { CardDetailsComponent } from './pages/components/card-details/card-details.component';
import { DeckComponent } from './pages/components/deck/deck.component';
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
    path: 'decks/:id',
    component: DeckComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
    ],
  },
];
