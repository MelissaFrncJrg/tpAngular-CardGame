import { DeckModel, DecksService } from '../../../services/decks.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarouselComponent } from '../../../../shared/carousel/carousel.component';
import { CardModel, CardsService } from '../../../services/cards.services';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSquareMinus,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [CommonModule, CarouselComponent, FormsModule, FontAwesomeModule],
  templateUrl: './deck.component.html',
  styleUrls: [
    './deck.component.scss',
    '../../../../shared/styles/_card-style.shared.scss',
    '../../../../shared/styles/_button-style.shared.scss',
  ],
})
export class DeckComponent implements OnInit {
  faSquareMinus = faSquareMinus;
  faTrash = faTrash;
  faXmark = faXmark;

  allCards: CardModel[] = [];
  decks: DeckModel[] = [];
  deckName: string = '';
  editedDeck: DeckModel = { name: '', cards: [] };
  isCreating: boolean = false;
  isEditing: boolean = false;
  selectedCards: CardModel[] = [];
  errorMsg = '';
  successMsg = '';

  constructor(
    private decksService: DecksService,
    private cardsService: CardsService
  ) {}

  ngOnInit(): void {
    this.cardsService.getAllCards().subscribe({
      next: (cards) => {
        this.allCards = cards;

        this.decksService.getAllDecks().subscribe({
          next: (data) => (this.decks = data),
          error: () => (this.errorMsg = 'Error loading decks'),
        });
      },
      error: () => (this.errorMsg = 'Error loading cards'),
    });
  }

  private resetAndScroll(): void {
    this.resetForm();
    setTimeout(() => {
      const carousel = document.querySelector('.decks-carousel');
      carousel?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  private isDeckValid(): boolean {
    if (!this.deckName.trim()) {
      this.errorMsg = 'Deck name is required.';
      return false;
    }

    if (this.selectedCards.length !== 5) {
      this.errorMsg = 'A deck must contain exactly 5 cards.';
      return false;
    }

    return true;
  }

  private replaceDeck(updatedDeck: DeckModel): void {
    const index = this.decks.findIndex((d) => d.id === updatedDeck.id);
    if (index !== -1) this.decks[index] = updatedDeck;
  }

  resetForm(): void {
    this.isCreating = false;
    this.isEditing = false;
    this.deckName = '';
    this.selectedCards = [];
    this.loadAllCards();
  }

  onDeckClick(deck: DeckModel): void {
    this.isEditing = true;
    this.isCreating = true;
    this.editedDeck = { ...deck };
    this.deckName = deck.name;
    this.errorMsg = '';
    this.successMsg = '';
    this.loadAllCards();
  }

  createMode(): void {
    this.isCreating = true;
    this.isEditing = false;
    this.deckName = '';
    this.selectedCards = [];
    this.errorMsg = '';
    this.successMsg = '';
    this.loadAllCards();
  }

  loadAllCards(): void {
    this.cardsService.getAllCards().subscribe({
      next: (cards) => {
        this.allCards = cards;

        if (this.isEditing && this.editedDeck.cards.length) {
          this.selectedCards = this.allCards.filter((card) =>
            this.editedDeck.cards.some((id) => String(id) === String(card.id))
          );
        }
      },
      error: () => {
        this.errorMsg = 'Error loading cards.';
      },
    });
  }

  submitDeck(): void {
    if (!this.isDeckValid()) {
      this.successMsg = '';
      return;
    }

    if (this.isEditing) {
      this.updateDeck(this.editedDeck);
      return;
    }

    const newDeck: Partial<DeckModel> = {
      name: this.deckName,
      cards: this.selectedCards.map((c) => String(c.id!)),
    };

    this.decksService.createDeck(newDeck).subscribe({
      next: (createdDeck) => {
        this.decks.push(createdDeck);
        this.successMsg = `Deck "${createdDeck.name}" created successfully!`;
        this.resetAndScroll();
      },
      error: () => {
        this.errorMsg = 'Error creating deck.';
        this.successMsg = '';
      },
    });
  }

  updateDeck(deck: DeckModel): void {
    if (!deck.id || !deck.name.trim()) {
      this.errorMsg = 'Invalid deck data.';
      return;
    }

    deck.name = this.deckName;
    deck.cards = this.selectedCards.map((c) => String(c.id!));

    this.decksService.updateDeck(deck).subscribe({
      next: (updatedDeck) => {
        this.replaceDeck(updatedDeck);

        this.successMsg = `Deck "${updatedDeck.name}" updated!`;
        (this.errorMsg = ''), this.resetAndScroll();
      },
      error: () => {
        this.errorMsg = 'Error updating deck.';
      },
    });
  }

  getDeckValue(deck: DeckModel): number {
    return deck.cards.reduce((sum: number, id: string | number) => {
      const card = this.allCards.find((card) => String(card.id) === String(id));
      return sum + (card?.value ?? 0);
    }, 0);
  }

  getTotalValue(): number {
    return this.selectedCards.reduce((sum, c) => sum + c.value, 0);
  }

  getAvailableCards(): CardModel[] {
    return this.allCards.filter((card) => !this.selectedCards.includes(card));
  }

  toggleCardSelection(card: CardModel): void {
    const index = this.selectedCards.findIndex(
      (c) => String(c.id) === String(card.id)
    );
    if (index > -1) {
      this.selectedCards.splice(index, 1);
    } else {
      if (this.selectedCards.length >= 5) {
        this.errorMsg = 'Decks are limited to 5 cards.';
        return;
      }
      if (this.getTotalValue() + card.value > 30) {
        this.errorMsg = 'Deck total value cannot exceed 30.';
        return;
      }
      this.selectedCards.push(card);
    }
  }

  deleteDeck(deckId: string | number): void {
    this.decksService.deleteDeck(String(deckId)).subscribe({
      next: () => {
        this.decks = this.decks.filter((deck) => deck.id !== deckId);
        this.successMsg = 'Deck deleted successfully.';
      },
      error: () => {
        this.errorMsg = 'Error deleting deck.';
      },
    });
  }

  confirmDelete(deckId: string | number): void {
    const confirmMsg =
      'This action is definitive. Are you sure you want to delete this deck?';

    if (confirm(confirmMsg)) {
      this.deleteDeck(deckId);
    }
  }
}
