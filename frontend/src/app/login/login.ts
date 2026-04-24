import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth} from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [],
  template: `
<div class="container">


  <!-- LOGIN -->
  <div class="card login">
    <h2>Login</h2>

    <input #loginName placeholder="Username" />
    <input #loginPass type="password" placeholder="Password" />

    <button (click)="login(loginName.value, loginPass.value)">Login</button>
  </div>

  <!-- REGISTER -->
  <div class="card register">
    <h2>Register</h2>

    <input #regName placeholder="Username" />
    <input #regPass type="password" placeholder="Password" />

    <button (click)="register(regName.value, regPass.value)">Register</button>
  </div>

</div>
`,
  styles: [`
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  margin-top: 60px;
}
.card {
  width: 300px;
  padding: 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h2 {
  text-align: center;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #4f46e5;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #4338ca;
}
`]
})


export class Login {

constructor(private auth: Auth, private router: Router) {} 

  login(username: string, password: string) {
  this.auth.login({
    email: username,
    password: password
  }).subscribe({
    next: res => 
      {
        console.log("Login success", res);
      this.router.navigate(['/adminPanel']);
      },
    error: err =>
      {
        console.error(err)
      }
      
  });
}

  register(username: string, password: string) {
  this.auth.register({
    email: username,
    password: password
  }).subscribe({
    next: res => {
      console.log("Register success", res);
      this.router.navigate(['/adminPanel']);
    },
    error: err => {
      console.error("Register failed", err);
    }
  });
}
}
