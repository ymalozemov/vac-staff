import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {

  constructor(private _el: ElementRef, private rend: Renderer2) { }

  @HostListener('input', ['$event']) onKeyPress(event) {
    const initalValue = this._el.nativeElement.value.trim().replace(/[^0-9/\s]*/g, '')
    this.rend.setProperty(this._el.nativeElement, 'value', initalValue)
  }
}
