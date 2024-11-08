import {Component, inject, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {LocationService} from '../location.service';
import {Router} from '@angular/router';
import {ConditionsAndZip} from '../conditions-and-zip.type';

@Component({
    selector: 'app-current-conditions',
    templateUrl: './current-conditions.component.html',
    styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

    private weatherService = inject(WeatherService);
    private router = inject(Router);
    protected locationService = inject(LocationService);
    protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

    selectedTab: number = 0;

    constructor() {
        const savedTab = localStorage.getItem('selectedTab');
        this.selectedTab = savedTab ? parseInt(savedTab) : 0;
    }

    showForecast(zipcode: string) {
        this.router.navigate(['/forecast', zipcode]);
    }

    selectElement(index: number) {
        this.selectedTab = index;
    }

    getSelectedCondition(): ConditionsAndZip | null {
        const conditions = this.currentConditionsByZip();
        return conditions.length > 0 ? conditions[this.selectedTab] : null;
    }
}
