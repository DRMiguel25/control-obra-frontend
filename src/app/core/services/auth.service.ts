import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    nameid?: string; // .NET uses 'nameid' for user ID
    unique_name?: string;
    email?: string;
    exp?: number;
    [key: string]: any;
}

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

    /**
     * Extracts the userId from the JWT token
     * @returns userId as a string, or null if token is invalid/missing
     */
    getCurrentUserId(): string | null {
        const token = this.getToken();
        if (!token) {
            console.warn('AuthService: No token available');
            return null;
        }

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            console.log('AuthService: Decoded token:', decoded);

            // .NET uses full claim URIs for standard claims
            const nameIdentifierClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
            const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

            // Check for .NET claim URIs first, then fall back to short names
            const userId = decoded[nameIdentifierClaim]
                || decoded[nameClaim]
                || decoded.nameid
                || decoded.unique_name
                || decoded['sub'];

            if (!userId) {
                console.error('AuthService: UserId not found in token claims');
                console.error('Available claims:', Object.keys(decoded));
                return null;
            }

            console.log('AuthService: Extracted userId:', userId);
            return String(userId); // Ensure it's a string
        } catch (error) {
            console.error('AuthService: Error decoding token:', error);
            return null;
        }
    }

    getCurrentUser(): { id: number, name: string, email: string, username: string } | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const userId = this.getCurrentUserId();

            if (!userId) return null;

            return {
                id: Number(userId),
                name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.unique_name || 'User',
                email: decoded.email || 'user@example.com',
                username: decoded.unique_name || 'user'
            };
        } catch (error) {
            console.error('AuthService: Error decoding token for user details:', error);
            return null;
        }
    }

    private setToken(token: string): void {
        sessionStorage.setItem(this.tokenKey, token);
        console.log('AuthService: setToken', token);
    }

    private hasToken(): boolean {
        return !!this.getToken();
    }
}

