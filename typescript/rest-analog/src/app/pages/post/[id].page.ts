import { Component, DestroyRef, inject, signal } from '@angular/core'
import { load } from './[id].server'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { injectLoad } from '@analogjs/router'
import { catchError, EMPTY, tap } from 'rxjs'
import { PostService } from '../../services/post.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-post-item',
  standalone: true,
  template: `
    <div>
      @if (pending()) {
        <p>
          <span class="loading"></span>
        </p>
      } @else if (error()) {
        <p>Error while fetching feed 💔</p>
      } @else {
        <main>
          <h2>
            {{ article().title }} ({{
              article().published ? 'Published' : 'Draft'
            }})
          </h2>
          <p>By {{ article().author.name }}</p>
          <div [innerHTML]="article().content"></div>
          <div class="btn-wrapper">
            @if (!article().published) {
              <button (click)="publish(article().id)">Publish</button>
            }
            <button (click)="destroy(article().id)">Delete</button>
          </div>
        </main>
      }
    </div>
  `,
  styles: [
    `
      .page {
        background: white;
        padding: 2rem;
      }

      .actions {
        margin-top: 2rem;
      }

      button {
        margin: 0.5rem;
        background: #ececec;
        border: 1px black solid;
        border-radius: 0.125rem;
        padding: 1rem 2rem;
      }

      button button {
        margin-left: 1rem;
      }

      .btn-wrapper {
        display: flex;
        justify-content: center;
        width: fit-content;
        margin-top: 1rem;
      }
    `,
  ],
  imports: [],
})
export default class PostItemComponent {
  #postService = inject(PostService)
  #router = inject(Router)
  #destroyRef = inject(DestroyRef)

  pending = signal(true)
  error = signal('')

  article = toSignal(
    injectLoad<typeof load>().pipe(
      tap(() => this.pending.set(false)),
      catchError((error) => {
        this.error.set(error.message)
        return EMPTY
      }),
    ),
    { requireSync: true },
  )

  destroy(): void {
    this.#postService
      .destroy(this.article().id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        void this.#router.navigate(['/'])
      })
  }

  publish(): void {
    this.#postService
      .publish(this.article().id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        void this.#router.navigate(['/'])
      })
  }
}
