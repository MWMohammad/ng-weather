import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.css']
})
export class TabComponent<T> {
    @Input() elements: T[] = [];
    @Input() tabTemplate: TemplateRef<any> | null = null;
    @Output() removeTabEmitter = new EventEmitter<T>();
    @Output() selectTabEmitter = new EventEmitter<number>();

    selectedTabIndex: number = 0;

    removeTab(index: number) {
        const elementToRemove = this.elements[index];
        this.removeTabEmitter.emit(elementToRemove);
        this.elements.splice(index, 1);
        if (this.selectedTabIndex >= index && this.selectedTabIndex > 0) {
            this.selectedTabIndex = Math.max(0, this.selectedTabIndex - 1);
        }
    }

    selectTab(index: number) {
        this.selectedTabIndex = index;
        this.selectTabEmitter.emit(index);
    }
}
