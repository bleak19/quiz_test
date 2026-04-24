import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Quiz } from './quiz/quiz';
import { Menu } from './menu/menu'
import { AdminPanel } from './admin-panel/admin-panel'
//import { Result } from '.result'
import { AuthGuard } from './AuthGuard'

export const routes: Routes = [
  { path: '', component: Login, pathMatch: 'full'},
  { path: 'quiz', component: Quiz},
  { path: 'adminPanel', component: AdminPanel, canActivate: [AuthGuard]},
  { path: 'test/:id', component: Quiz}

  //{ path: 'adminPanel', component: AdminPanel}
  //{ path: 'result', component: Result }
];