// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor() {}

  // Kullanıcının rolünü getir
  getUserRole(): string | null {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return user?.role?.roleTypeEnum || user?.role || null;
  }

  // Kullanıcının login olup olmadığını kontrol et
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('user');
  }

  // Kullanıcıyı çıkış yaptır
  logout(): void {
    sessionStorage.removeItem('user');
  }
}
