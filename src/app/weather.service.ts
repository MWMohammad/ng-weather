import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  static CACHE_DURATION = 2 * 60 * 60;
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(
      private http: HttpClient,
      private cacheService: CacheService,
      private locationService: LocationService
  ) {
    this.locationService.removedLocation$.subscribe(locations => {
      this.removeCurrentConditions(locations);
    });
    this.locationService.addedLocation$.subscribe(locations => {
      this.addCurrentConditions(locations);
    });
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update(conditions => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode)
          conditions.splice(+i, 1);
      }
      return conditions;
    })
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }


  addCurrentConditions(zipcode: string): void {
    const cacheKey = `currentConditions-${zipcode}`;
    const cachedData = this.cacheService.getCache<CurrentConditions>(cacheKey);

    if (cachedData) {
      this.currentConditions.update(conditions => [
        ...conditions,
        { zip: zipcode, data: cachedData },
      ]);
    } else {
      this.http.get<CurrentConditions>(
          `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`
      )
          .pipe(
              tap(data => this.cacheService.setCache(cacheKey, data, WeatherService.CACHE_DURATION)),
              catchError(error => {
                console.error(`Failed to fetch data for ${zipcode}`, error);
                this.locationService.removeLocation(zipcode);
                return of(null);
              })
          )
          .subscribe(data => {
            if (data) {
              this.currentConditions.update(conditions => [
                ...conditions,
                { zip: zipcode, data },
              ]);
            }
          });
    }
  }

  getForecast(zipcode: string): Observable<Forecast> {
    const cacheKey = `forecast-${zipcode}`;
    const cachedData = this.cacheService.getCache<Forecast>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    } else {
      return this.http.get<Forecast>(
          `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
      ).pipe(
          tap(data => this.cacheService.setCache(cacheKey, data, WeatherService.CACHE_DURATION)),
          catchError(error => {
            console.error(`Failed to fetch forecast for ${zipcode}`, error);
            return of(null);
          })
      );
    }
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }

}
