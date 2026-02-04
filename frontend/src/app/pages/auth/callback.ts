import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-auth-callback',
    template: `
        <div class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                <p class="text-xl">Completing authentication...</p>
            </div>
        </div>
    `
})
export class AuthCallback implements OnInit {
    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit() {
        // Handle the OAuth callback and redirect based on user role
        this.authService.handleCallback().then(() => {
            const profile = this.authService.userProfile;
            const roles = profile?.realm_access?.roles || [];

            if (roles.includes('doctor')) {
                this.router.navigate(['/doctor']);
            } else {
                this.router.navigate(['/app']);
            }
        }).catch((error) => {
            console.error('Authentication error:', error);
            this.router.navigate(['/auth/login']);
        });
    }
}