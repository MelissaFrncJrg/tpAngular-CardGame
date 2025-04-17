import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CardModel {
  id?: string;
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private readonly apiUrl = 'http://localhost:3000/api/cards';

  constructor(private http: HttpClient) {}

  getCardbyId(id: string): Observable<CardModel> {
    return this.http.get<CardModel>(`${this.apiUrl}/${id}`);
  }

  getAllCards(): Observable<CardModel[]> {
    return this.http.get<CardModel[]>(this.apiUrl);
  }

  createCard(card: Partial<CardModel>): Observable<CardModel> {
    return this.http.post<CardModel>(this.apiUrl, card);
  }

  updateCard(card: CardModel): Observable<CardModel> {
    return this.http.post<CardModel>(`${this.apiUrl}`, card);
  }

  deleteCard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
