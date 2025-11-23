import { Component, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-register-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    errorMessage = signal<string>('');
    isLoading = signal<boolean>(false);

    passwordMatchValidator(g: any) {
        return g.get('password').value === g.get('confirmPassword').value
            ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.registerForm.invalid) return;

        this.isLoading.set(true);
        this.errorMessage.set('');

        const { confirmPassword, ...userData } = this.registerForm.value;
        // Payload: { name, email, password } - backend generates username automatically
        console.log('=== REGISTRO: Payload enviado al backend ===', userData);

        this.authService.register(userData).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                console.log('Registro exitoso:', response);
                alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Registration error:', err);

                // Provide detailed error messages
                if (err.status === 0) {
                    this.errorMessage.set('❌ No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:5000');
                } else if (err.status === 400) {
                    this.errorMessage.set('Error: ' + (err.error?.message || 'Datos inválidos'));
                } else if (err.status === 409) {
                    this.errorMessage.set('Error: El usuario o email ya existe');
                } else if (err.status === 500) {
                    this.errorMessage.set('Error del servidor. Revisa los logs del backend.');
                } else {
                    this.errorMessage.set(`Error al registrar usuario (${err.status}): ${err.error?.message || 'Intente nuevamente'}`);
                }
            }
        });
    }
}
