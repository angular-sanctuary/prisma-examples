import { Component, DestroyRef, inject } from '@angular/core'
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { PostService } from '../../services/post.service'
import { AuthService } from '../../services/auth.service'
import { map } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-create',
  standalone: true,
  template: `
    <div class="page">
      <form [formGroup]="form" (submit)="createDraft()">
        <h1>Create Draft</h1>
        <input
          autoFocus
          placeholder="Title"
          type="text"
          formControlName="title"
        />
        <input
          placeholder="Author (email address)"
          type="text"
          formControlName="authorEmail"
        />
        @if (
          form.value.authorEmail &&
          form.controls.authorEmail.errors?.authorExists
        ) {
          <span
            >'{{ form.value.authorEmail }}' does not exists in our
            database.</span
          >
        }
        <textarea
          cols="50"
          placeholder="Content"
          rows="8"
          formControlName="content"
        ></textarea>
        <input
          [class.primary]="form.valid"
          [disabled]="form.invalid"
          type="submit"
          value="Create"
        />
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
        align-items: center;
      }

      input[type='text'],
      textarea {
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

      span {
        color: red;
      }

      .primary {
        background: blue !important;
        color: white;
      }
    `,
  ],
  imports: [ReactiveFormsModule, RouterLink],
})
export default class CreateComponent {
  #postService = inject(PostService)
  #authService = inject(AuthService)
  #router = inject(Router)
  #destroyRef = inject(DestroyRef)

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    authorEmail: new FormControl('', {
      asyncValidators: this.validateEmail(),
      updateOn: 'blur',
    }),
    content: new FormControl(''),
  })

  createDraft(): void {
    this.#postService
      .createDraft(
        this.form.value.title,
        this.form.value.authorEmail,
        this.form.value.content,
      )
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.#router.navigate(['/drafts']),
        error: (err) => console.error(err),
      })
  }

  validateEmail(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.#authService
        .findAuthor(control.value)
        .pipe(map((res) => (Boolean(res) ? null : { authorExists: true })))
    }
  }
}
