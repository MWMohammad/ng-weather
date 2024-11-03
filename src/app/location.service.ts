import {ReplaySubject, Subject} from 'rxjs';
import {Injectable} from '@angular/core';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocationService {

    readonly addedLocation$: ReplaySubject<string> = new ReplaySubject<string>();
    readonly removedLocation$: Subject<string> = new Subject<string>();
    locations: Set<string> = new Set<string>;

    constructor() {
        const locString = localStorage.getItem(LOCATIONS);
        if (locString) {
            this.locations =  new Set(JSON.parse(locString));
            for (let loc of  this.locations) {
                this.addedLocation$.next(loc);
            }
        }
    }

    addLocation(zipcode: string) {
        if (!this.locations.has(zipcode)) {
            this.locations.add(zipcode);
            localStorage.setItem(LOCATIONS, JSON.stringify(Array.from(this.locations)));
            this.addedLocation$.next(zipcode);
        }
    }

    removeLocation(zipcode: string) {
        this.locations.delete(zipcode);
        localStorage.setItem(LOCATIONS, JSON.stringify(Array.from(this.locations)));
        this.removedLocation$.next(zipcode);
    }
}
