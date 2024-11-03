import {BehaviorSubject, Subject} from 'rxjs';
import {Injectable} from '@angular/core';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocationService {

//  private locationsSubject = new BehaviorSubject<string[]>([]);
//  locations$ = this.locationsSubject.asObservable();

    readonly addedLocation$: Subject<string> = new Subject<string>();
    readonly removedLocation$: Subject<string> = new Subject<string>();


    locations: Set<string> = new Set<string>;

    constructor() {
        const locString = localStorage.getItem(LOCATIONS);
        const initialLocations = locString ? JSON.parse(locString) : [];

        if (locString) {
            this.locations = JSON.parse(locString);
        }

        for (let loc of initialLocations) {
            this.addedLocation$.next(loc);
        }
    }

    addLocation(zipcode: string) {
        this.locations.add(zipcode);
        this.addedLocation$.next(zipcode);
    }

    removeLocation(zipcode: string) {
        this.locations.delete(zipcode);
        this.removedLocation$.next(zipcode);
    }
}
