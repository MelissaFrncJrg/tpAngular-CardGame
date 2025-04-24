import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeckModel, DecksService } from '../../../services/decks.service';
import { CardModel, CardsService } from '../../../services/cards.services';

@Component({
  selector: 'app-game',
  imports: [CommonModule, FormsModule, NgFor, NgIf, NgClass],
  templateUrl: './game.component.html',
  styleUrls: [
    './game.component.scss',
    '../../../../shared/styles/_button-style.shared.scss',
  ],
  standalone: true,
})
export class GameComponent {
  errorMsg?: string;

  gameState: 'deck-selection' | 'playing' | 'game-over' = 'deck-selection';
  currentRound = 1;
  maxRounds = 5;

  decks: DeckModel[] = [];
  playerDeck?: DeckModel;
  opponentDeck?: DeckModel;

  cards: CardModel[] = [];
  playerSelectedCard?: CardModel;
  opponentSelectedCard?: CardModel;
  playerPlayedCards: number[] = [];

  playerScore = 0;
  opponentScore = 0;

  isPlayerReady = false;
  isOpponentReady = false;

  constructor(
    private deckService: DecksService,
    private cardService: CardsService
  ) {}

  ngOnInit(): void {
    this.loadCards();
    this.loadDecks();
  }

  loadCards(): void {
    this.cardService.getAllCards().subscribe({
      next: (cards) => {
        this.cards = cards.map((card) => ({
          ...card,
          id: typeof card.id === 'string' ? parseInt(card.id, 10) : card.id,
        }));
      },
      error: () => (this.errorMsg = 'Failed to load cards'),
    });
  }

  getCardById(id: string | number): CardModel | undefined {
    return this.cards.find((card) => String(card.id) === String(id));
  }

  loadDecks(): void {
    this.deckService.getAllDecks().subscribe({
      next: (data) => {
        this.decks = data.map((deck) => ({
          ...deck,
          id: typeof deck.id === 'string' ? parseInt(deck.id, 10) : deck.id,
          cards: deck.cards.map((cid) =>
            typeof cid === 'string' ? parseInt(cid, 10) : cid
          ),
        }));
      },
      error: (err) => {
        this.errorMsg = 'Error loading decks';
      },
    });
  }

  selectDeck(deck: DeckModel) {
    if (!deck || this.gameState !== 'deck-selection') return;

    this.playerDeck = deck;

    const availableDecks = this.decks.filter((d) => d.id !== deck.id);
    if (availableDecks.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableDecks.length);
      this.opponentDeck = availableDecks[randomIndex];

      this.gameState = 'playing';
    } else {
      this.errorMsg = 'No available decks for opponent';
    }
  }

  selectCard(card: CardModel) {
    if (!card || this.gameState !== 'playing' || this.isPlayerReady) return;

    if (this.playerPlayedCards.includes(Number(card.id))) {
      this.errorMsg = 'You already played this card';
      return;
    }

    this.playerSelectedCard = card;
    this.errorMsg = undefined;
  }

  confirmReadyToPlay(): void {
    if (!this.playerSelectedCard) {
      this.errorMsg = 'You must choose a card to start the game!';
      return;
    }

    this.isPlayerReady = true;
    this.playerPlayedCards.push(Number(this.playerSelectedCard.id));

    this.simulateOpponentPlay();
  }

  simulateOpponentPlay(): void {
    if (!this.opponentDeck || this.isOpponentReady) return;

    const availableCards = this.opponentDeck.cards
      .map((cardId: string | number) => this.getCardById(cardId))
      .filter((card): card is CardModel => card !== undefined);

    if (availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      this.opponentSelectedCard = availableCards[randomIndex];
      this.isOpponentReady = true;

      if (this.isPlayerReady) {
        setTimeout(() => this.resolveRound(), 500);
      }
    }
  }

  resolveRound(): void {
    if (!this.isPlayerReady || !this.isOpponentReady) return;

    if (this.playerSelectedCard && this.opponentSelectedCard) {
      if (this.playerSelectedCard.value > this.opponentSelectedCard.value) {
        this.playerScore++;
      } else if (
        this.playerSelectedCard.value < this.opponentSelectedCard.value
      ) {
        this.opponentScore++;
      }
    }

    if (this.currentRound >= this.maxRounds) {
      this.gameState = 'game-over';
    } else {
      this.currentRound++;
      this.resetRound();
    }
  }

  resetRound() {
    this.isPlayerReady = false;
    this.isOpponentReady = false;
    this.playerSelectedCard = undefined;
    this.opponentSelectedCard = undefined;
  }

  restartGame() {
    this.gameState = 'deck-selection';
    this.playerDeck = undefined;
    this.opponentDeck = undefined;
    this.currentRound = 1;
    this.playerScore = 0;
    this.opponentScore = 0;
    this.playerPlayedCards = [];
    this.resetRound();
  }
}
