import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModel, CardsService } from '../../../services/cards.services';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cards',
  imports: [NgIf, NgFor, CommonModule, RouterModule],
  templateUrl: './cards.component.html',
  styleUrl: '../../../../styles/shared/_card-style.shared.scss',
  standalone: true,
})
export class CardsComponent implements OnInit {
  cards: CardModel[] = [];
  errorMsg?: string;

  constructor(private cardsService: CardsService) {}

  ngOnInit(): void {
    this.loadCards();
  }

  async loadCards(): Promise<void> {
    this.cardsService.getAllCards().subscribe({
      next: (data) => {
        console.log('cards:', data);
        this.cards = data;
      },

      error: (err) => {
        this.errorMsg = 'Error loading cards: ';
        console.log(err);
      },
    });
  }
}
