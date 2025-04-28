import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardModel } from './cards.services';

export interface DeckModel {
  id?: string | number;
  name: string;
  cards: (string | number)[];
}

@Injectable({
  providedIn: 'root',
})
export class DecksService {
  private readonly apiUrl = 'http://localhost:3000/api/decks';

  constructor(private http: HttpClient) {}

  getDeckbyId(id: string | number): Observable<DeckModel> {
    return this.http.get<DeckModel>(`${this.apiUrl}/${id}`);
  }

  getAllDecks(): Observable<DeckModel[]> {
    return this.http.get<DeckModel[]>(this.apiUrl);
  }

  createDeck(deck: Partial<DeckModel>): Observable<DeckModel> {
    return this.http.put<DeckModel>(this.apiUrl, deck);
  }

  updateDeck(deck: DeckModel): Observable<DeckModel> {
    return this.http.post<DeckModel>(`${this.apiUrl}`, deck);
  }

  deleteDeck(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  calculateDeckValue(deck: DeckModel, allCards: CardModel[]): number {
    if (!deck || !deck.cards) return 0;

    return deck.cards.reduce((sum: number, id: string | number) => {
      const card = allCards.find((card) => String(card.id) === String(id));
      return sum + (card?.value ?? 0);
    }, 0);
  }
}
