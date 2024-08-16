import { Component, DestroyRef, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { AuthService } from '../../services/auth.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

type AuthForm = {
  name: FormControl<string>
  email: FormControl<string>
}

@Component({
  selector: 'app-signup',
  standalone: true,
  template: `
    <div class="page">
      <form [formGroup]="form" (submit)="signup()">
        <h1>Signup user</h1>
        <input
          autoFocus
          placeholder="Name"
          type="text"
          formControlName="name"
        />
        <input
          placeholder="Email address"
          type="text"
          formControlName="email"
        />
        <input [disabled]="form.invalid" type="submit" value="Signup" />
        <a class="back" routerLink="/"> or Cancel </a>
      </form>
    </div>
  `,
  styles: [
    `
      .page {
        background: white;
        padding: 3rem;
        display: flex;
        justify-content: center;
      }

      input[type='text'] {
        width: 100%;
        padding: 0.5rem;
        margin: 0.5rem 0;
        border-radius: 0.25rem;
        border: 0.125rem solid rgba(0, 0, 0, 0.2);
      }

      input[type='submit'] {
        background: #ececec;
        border: 0;
        padding: 1rem 2rem;
      }

      .back {
        margin-left: 1rem;
      }
    `,
  ],
  imports: [RouterLink, ReactiveFormsModule],
})
export default class SignupComponent {
  #authService = inject(AuthService)
  #router = inject(Router)
  #destroyRef = inject(DestroyRef)

  form = new FormGroup<AuthForm>({
    name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    email: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  })

  signup(): void {
    this.#authService
      .signup(this.form.value.name, this.form.value.email)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.#router.navigate(['/']),
        error: (error) => console.error(error),
      })
  }
}
