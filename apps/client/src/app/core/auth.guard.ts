import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { DataService } from '@ghostfolio/client/services/data.service';
import { SettingsStorageService } from '@ghostfolio/client/services/settings-storage.service';
import { UserService } from '@ghostfolio/client/services/user/user.service';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private static PUBLIC_PAGE_ROUTES = [
    '/about',
    '/about/changelog',
    '/about/privacy-policy',
    '/blog',
    '/de/blog',
    '/demo',
    '/en/blog',
    '/faq',
    '/features',
    '/markets',
    '/open',
    '/p',
    '/pricing',
    '/register',
    '/resources'
  ];

  constructor(
    private dataService: DataService,
    private router: Router,
    private settingsStorageService: SettingsStorageService,
    private userService: UserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const utmSource = route.queryParams?.utm_source;

    if (utmSource) {
      this.settingsStorageService.setSetting('utm_source', utmSource);
    }

    return new Promise<boolean>((resolve) => {
      this.userService
        .get()
        .pipe(
          catchError(() => {
            if (utmSource === 'ios') {
              this.router.navigate(['/demo']);
              resolve(false);
            } else if (utmSource === 'trusted-web-activity') {
              this.router.navigate(['/register']);
              resolve(false);
            } else if (
              AuthGuard.PUBLIC_PAGE_ROUTES.filter((publicPageRoute) =>
                state.url.startsWith(publicPageRoute)
              )?.length > 0
            ) {
              resolve(true);
              return EMPTY;
            } else if (state.url !== '/start') {
              this.router.navigate(['/start']);
              resolve(false);
              return EMPTY;
            }

            resolve(true);
            return EMPTY;
          })
        )
        .subscribe((user) => {
          const userLanguage = user?.settings?.language;

          if (userLanguage && document.documentElement.lang !== userLanguage) {
            this.dataService
              .putUserSetting({ language: document.documentElement.lang })
              .subscribe(() => {
                this.userService.remove();

                setTimeout(() => {
                  window.location.reload();
                }, 300);
              });

            resolve(true);
            return;
          } else if (
            state.url.startsWith('/home') &&
            user.settings.viewMode === 'ZEN'
          ) {
            this.router.navigate(['/zen']);
            resolve(false);
            return;
          } else if (state.url.startsWith('/start')) {
            if (user.settings.viewMode === 'ZEN') {
              this.router.navigate(['/zen']);
            } else {
              this.router.navigate(['/home']);
            }

            resolve(false);
            return;
          } else if (
            state.url.startsWith('/zen') &&
            user.settings.viewMode === 'DEFAULT'
          ) {
            this.router.navigate(['/home']);
            resolve(false);
            return;
          }

          resolve(true);
        });
    });
  }
}
