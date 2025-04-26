import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModel, CardsService } from '../../../services/cards.services';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from '../../../../shared/carousel/carousel.component';

@Component({
  selector: 'app-cards',
  imports: [NgIf, FormsModule, CommonModule, RouterModule, CarouselComponent],
  templateUrl: './cards.component.html',
  styleUrls: [
    '../../../../shared/styles/_card-style.shared.scss',
    './cards.component.scss',
    '../../../../shared/styles/_button-style.shared.scss',
  ],
  standalone: true,
})
export class CardsComponent implements OnInit {
  cards: CardModel[] = [];
  errorMsg?: string;

  isCreating: boolean = false;
  editedCard: Partial<CardModel> = { name: '', description: '', value: 0 };

  constructor(private cardsService: CardsService) {}

  ngOnInit(): void {
    this.cardsService.getAllCards().subscribe({
      next: (data) => {
        this.cards = data;
      },

      error: (err) => {
        this.showThenClearError('Error loading cards: '), err;
      },
    });
  }

  private showThenClearError(message: string): void {
    this.errorMsg = message;
    setTimeout(() => {
      this.errorMsg = '';
    }, 5000);
  }

  startCreateCard(): void {
    this.editedCard = { name: '', description: '', value: 0 };
    this.isCreating = true;
  }

  get formInvalid(): boolean {
    return (
      !this.editedCard.name?.trim() ||
      !this.editedCard.description?.trim() ||
      this.editedCard.value == null ||
      this.editedCard.value <= 0 ||
      this.editedCard.value > 20
    );
  }

  onSave(): void {
    if (this.formInvalid) {
      this.showThenClearError('Please complete all required fields.');
      return;
    }

    this.cardsService.createCard(this.editedCard).subscribe({
      next: (createdCard) => {
        this.cards.push(createdCard);
        this.isCreating = false;
      },
      error: (err) => {
        this.showThenClearError('Error creating card.');
        console.error('Error creating card:', err);
      },
    });
  }

  cancelCreate(): void {
    this.isCreating = false;
  }
}
