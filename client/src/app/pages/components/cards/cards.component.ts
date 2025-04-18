import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { CardModel, CardsService } from '../../../services/cards.services';
import { RouterModule } from '@angular/router';
import { max } from 'rxjs';

@Component({
  selector: 'app-cards',
  imports: [NgIf, NgFor, CommonModule, RouterModule],
  templateUrl: './cards.component.html',
  styleUrls: [
    '../../../../styles/shared/_card-style.shared.scss',
    './cards.component.scss',
  ],
  standalone: true,
})
export class CardsComponent implements OnInit {
  cards: CardModel[] = [];
  errorMsg?: string;

  currentIndex: number = 0;
  visibleSlides: number = 4;
  slideWidth: number = 200;

  constructor(private cardsService: CardsService) {}

  ngOnInit(): void {
    this.loadCards();
    this.onResize();
  }

  async loadCards(): Promise<void> {
    this.cardsService.getAllCards().subscribe({
      next: (data) => {
        this.cards = data;
      },

      error: (err) => {
        this.errorMsg = 'Error loading cards: ';
      },
    });
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth < 768) {
      this.visibleSlides = 1;
    } else if (window.innerWidth < 992) {
      this.visibleSlides = 2;
    } else {
      this.visibleSlides = 3;
    }
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.cards.length - 1;
    }
  }

  nextSlide(): void {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.cards.length) {
      this.currentIndex = index;
    }
  }

  getDotArray(): number[] {
    return Array(this.cards.length)
      .fill(0)
      .map((_, i) => i);
  }

  getSlideTransform(index: number): string {
    const distance = Math.abs(index - this.currentIndex);

    if (index === this.currentIndex) {
      return 'scale(1.50) z-index(90)';
    } else if (distance <= 1) {
      const scale = 1 - distance * 0.05;
      return `scale(${scale}) translateZ(0)`;
    } else {
      return 'scale(0.9) translateZ(-50)';
    }
  }

  getCarouselTransform(): string {
    const containerWidth =
      document.querySelector('.carousel-track')?.clientWidth || 0;

    const centerOffset = (containerWidth - this.slideWidth) / 2;

    return `translateX(${
      -this.currentIndex * this.slideWidth + centerOffset
    }px)`;
  }
}
