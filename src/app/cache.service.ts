import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CacheService {


    setCache<T>(key: string, data: T, ttl: number = 7200): void {
        const expiry = new Date().getTime() + ttl * 1000;
        const cacheData = { data, expiry };
        localStorage.setItem(key, JSON.stringify(cacheData));
    }


    getCache<T>(key: string): T | null {
        const cachedData = localStorage.getItem(key);
        if (!cachedData) return null;

        try {
            const { data, expiry } = JSON.parse(cachedData);
            if (new Date().getTime() > expiry) {
                this.clearCache(key);
                return null;
            }
            return data;
        } catch (error) {
            console.error(`Error parsing cache data for key: ${key}`, error);
            this.clearCache(key); 
            return null;
        }
    }





    clearCache(key: string): void {
        localStorage.removeItem(key);
    }

    clearAllCache(): void {
        localStorage.clear();
    }

    isCacheValid(key: string): boolean {
        const cachedData = localStorage.getItem(key);
        if (!cachedData) return false;

        try {
            const { expiry } = JSON.parse(cachedData);
            return new Date().getTime() <= expiry;
        } catch (error) {
            localStorage.removeItem(key);
            return false;
        }
    }
}
