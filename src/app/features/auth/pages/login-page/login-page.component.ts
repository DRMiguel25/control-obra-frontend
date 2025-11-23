import { Component, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    errorMessage = signal<string>('');
    isLoading = signal<boolean>(false);

    onSubmit() {
        if (this.loginForm.invalid) return;

        this.isLoading.set(true);
        this.errorMessage.set('');

        const credentials = this.loginForm.value;

        console.log('Intentando login con credenciales:', credentials);

        this.authService.login(credentials).subscribe({
            next: () => {
                this.isLoading.set(false);
                console.log('Login exitoso');
                this.router.navigate(['/proyectos']);
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Login error:', err);

                if (err.status === 0) {
                    this.errorMessage.set('❌ No se puede conectar al servidor.');
                } else if (err.status === 401) {
                    this.errorMessage.set('❌ Usuario o contraseña incorrectos');
                } else if (err.status === 404) {
                    this.errorMessage.set('❌ Usuario no encontrado');
                } else if (err.status === 500) {
                    this.errorMessage.set('Error del servidor.');
                } else {
                    this.errorMessage.set(`Error en el servidor (${err.status})`);
                }
            }
        });
    }
}