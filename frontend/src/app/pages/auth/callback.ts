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
        // Handle the OAuth callback
        this.authService.handleCallback().then(() => {
            this.router.navigate(['/app']);
        }).catch((error) => {
            console.error('Authentication error:', error);
            this.router.navigate(['/auth/login']);
        });
    }
}