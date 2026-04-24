import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import {Auth} from "./services/auth"

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth : Auth
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.user().pipe(
      map(() => true), // if request succeeds → user is authenticated
      catchError(() => of(this.router.createUrlTree([''])))
    );
  }
}
