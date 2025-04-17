import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModel, CardsService } from '../../../services/cards.services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './card-details.component.html',
  styleUrls: [
    '../../../../styles/shared/_card-style.shared.scss',
    '../../../../styles/shared/_button-style.shared.scss',
  ],
  standalone: true,
})
export class CardDetailsComponent {
  card?: CardModel;
  errorMsg?: string;

  constructor(
    private route: ActivatedRoute,
    private cardsService: CardsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      this.cardsService.getCardbyId(cardId).subscribe({
        next: (data) => {
          this.card = data;
        },
        error: (err) => {
          this.errorMsg = 'Error when trying to load this card.';
          console.error(err);
        },
      });
    }
  }

  editMode = false;
  editedCard: CardModel = { name: '', value: 0 };

  onEdit(): void {
    if (!this.card) return;
    this.editedCard = { ...this.card };
    this.editMode = true;
  }

  onSave(): void {
    if (!this.editedCard.id) return;

    this.cardsService.updateCard(this.editedCard).subscribe({
      next: () => {
        this.card = { ...this.editedCard };
        this.editMode = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to update the card.';
        console.error(err);
      },
    });
  }

  onDelete(): void {
    if (!this.card?.id) return;

    if (confirm('Are you sure you want to delete this card?')) {
      this.cardsService.deleteCard(this.card.id).subscribe({
        next: () => this.router.navigate(['/cards']),
        error: (err) => {
          this.errorMsg = 'Failed to delete the card.';
          console.error(err);
        },
      });
    }
  }

  backToCardsList(): void {
    this.router.navigate(['/cards']);
  }
}
