export interface BaseModel {
  id?: string | undefined;
}

export interface CardBasicModel extends BaseModel {
  name: string;
}
export interface CardModel extends CardBasicModel {
  value: number;
}

export interface DeckModel extends BaseModel {
  name: string;
  cards: string[];
}

export interface DeckWithCardsModel extends BaseModel {
  name: string;
  cards: CardModel[];
}
