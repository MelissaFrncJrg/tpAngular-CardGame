import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModel, CardsService } from '../../../services/cards.services';
import { RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-cards',
  imports: [NgIf, NgFor, CommonModule, RouterModule, SlickCarouselModule],
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

  trackByCardId(index: number, card: CardModel): string | undefined {
    return card.id;
  }

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: false,
    arrows: true,
  };
}
