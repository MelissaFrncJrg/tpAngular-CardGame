import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  HostListener,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  @Input() items: any[] = [];
  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>;

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  isLoading = true;

  currentIndex = 0;
  slideWidth = 200;
  visibleSlides = 3;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.onResize();

    setTimeout(() => {
      this.isLoading = false;
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 100);
    }, 500);
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
      this.currentIndex = this.items.length - 1;
    }
  }

  nextSlide(): void {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.items.length) {
      this.currentIndex = index;
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

  getSlideTransform(index: number): string {
    const distance = Math.abs(index - this.currentIndex);
    if (index === this.currentIndex) {
      return 'scale(1.15) translateZ(20px)';
    } else if (distance <= 1) {
      const scale = 1 - distance * 0.05;
      return `scale(${scale}) translateZ(0)`;
    } else {
      return 'scale(0.9) translateZ(-50)';
    }
  }

  getDotArray(): number[] {
    return Array(this.items.length)
      .fill(0)
      .map((_, i) => i);
  }
}
