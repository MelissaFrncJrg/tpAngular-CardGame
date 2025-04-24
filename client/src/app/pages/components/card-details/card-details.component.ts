import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, resolveForwardRef } from '@angular/core';
import { CardModel, CardsService } from '../../../services/cards.services';
import { DecksService } from '../../../services/decks.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faPenSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-details',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './card-details.component.html',
  styleUrls: [
    './card-details.component.scss',
    '../../../../shared/styles/_card-style.shared.scss',
    '../../../../shared/styles/_button-style.shared.scss',
  ],
  standalone: true,
})
export class CardDetailsComponent {
  faArrowLeft = faArrowLeft;
  faPenSquare = faPenSquare;
  faTrash = faTrash;

  card?: CardModel;
  errorMsg?: string;

  constructor(
    private route: ActivatedRoute,
    private cardsService: CardsService,
    private decksService: DecksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const cardIdParam = this.route.snapshot.paramMap.get('id');
    if (cardIdParam) {
      this.cardsService.getCardbyId(cardIdParam).subscribe({
        next: (data) => {
          this.card = data;
        },
        error: (err) => {
          this.errorMsg = 'Error when trying to load this card.';
        },
      });
    }
  }

  private isCardInDeck(cardId: string | number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.decksService.getAllDecks().subscribe({
        next: (decks) => {
          const isUsed = decks.some((deck) =>
            deck.cards.some((id) => String(id) === String(cardId))
          );
          resolve(isUsed);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  private showThenClearError(message: string): void {
    this.errorMsg = message;
    setTimeout(() => {
      this.errorMsg = '';
    }, 50000000);
  }

  editMode = false;
  editedCard: CardModel = { name: '', description: '', value: 0 };

  onEdit(): void {
    if (!this.card) return;
    this.editedCard = { ...this.card };
    this.editMode = true;
  }

  onSave(): void {
    if (!this.editedCard.id) return;

    if (this.editedCard.value > 20) {
      this.showThenClearError('Card value must not exceed 20');
      return;
    }

    this.cardsService.updateCard(this.editedCard).subscribe({
      next: () => {
        this.card = { ...this.editedCard };
        this.editMode = false;
      },
      error: (err) => {
        this.showThenClearError('Failed to update the card.');
      },
    });
  }

  onDelete(): void {
    if (!this.card?.id) return;

    this.isCardInDeck(this.card.id)
      .then((isUsed) => {
        if (isUsed) {
          this.showThenClearError(
            'You can’t delete a card that is part of a deck.'
          );
          return;
        }

        if (confirm('Are you sure you want to delete this card?')) {
          this.cardsService.deleteCard(String(this.card?.id)).subscribe({
            next: () => this.router.navigate(['/layout/cards']),
            error: (err) => {
              this.showThenClearError('Failed to delete the card.');
            },
          });
        }
      })
      .catch((err) => {
        this.showThenClearError('Failed to verify decks.');
      });
  }

  backToCardsList(): void {
    this.router.navigate(['/layout/cards']);
  }
}
