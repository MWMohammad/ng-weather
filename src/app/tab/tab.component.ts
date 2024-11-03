import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';

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

    constructor() {
        const savedTab = localStorage.getItem('selectedTab');
        this.selectedTabIndex = savedTab ? parseInt(savedTab) : 0;
    }

    removeTab(index: number) {
        const elementToRemove = this.elements[index];
        this.removeTabEmitter.emit(elementToRemove);
        if (this.selectedTabIndex >= index && this.selectedTabIndex > 0) {
            this.selectedTabIndex = Math.max(0, this.selectedTabIndex - 1);
            this.selectTab(this.selectedTabIndex);
        }
    }

    selectTab(index: number) {
        this.selectedTabIndex = index;
        localStorage.setItem('selectedTab', index.toString());
        this.selectTabEmitter.emit(index);
    }
}
