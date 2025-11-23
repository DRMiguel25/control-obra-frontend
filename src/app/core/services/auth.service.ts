import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5000/api/auth'; // Adjust if needed
    private tokenKey = 'auth_token';

    // Signal to track login status reactively
    isLoggedIn = signal<boolean>(this.hasToken());

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: any): Observable<any> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response.token) {
                    this.setToken(response.token);
                    this.isLoggedIn.set(true);
                    console.log('AuthService: login successful, token stored', response.token);
                }
            })
        );
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData).pipe(
            tap(response => {
                console.log('AuthService: register response', response);
            })
        );
    }

    logout(): void {
        sessionStorage.removeItem(this.tokenKey);
        this.isLoggedIn.set(false);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        const token = sessionStorage.getItem(this.tokenKey);
        console.log('AuthService: getToken ->', token);
        return token;
    }

    private setToken(token: string): void {
        sessionStorage.setItem(this.tokenKey, token);
        console.log('AuthService: setToken', token);
    }

    private hasToken(): boolean {
        return !!this.getToken();
    }
}
