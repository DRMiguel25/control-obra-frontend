import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    // Clone the request to add the authentication header if the token exists
    // BUT skip external APIs like Google Gemini
    let authReq = req;
    const isExternalApi = req.url.includes('googleapis.com');

    if (token && !isExternalApi) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error) => {
            if (error.status === 401) {
                // Auto logout if 401 response returned from api
                authService.logout();
            }
            return throwError(() => error);
        })
    );
};
