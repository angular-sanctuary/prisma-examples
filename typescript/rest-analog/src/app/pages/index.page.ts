import { Component, signal } from '@angular/core'
import { PostComponent } from '../components/post/post.component'
import { load } from './index.server'
import { toSignal } from '@angular/core/rxjs-interop'
import { injectLoad } from '@analogjs/router'
import { catchError, EMPTY, tap } from 'rxjs'

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="page">
      <h1>My Blog</h1>
      <main>
        @if (pending()) {
          <p>
            <span class="loading"></span>
          </p>
        } @else if (error()) {
          <p>Error while fetching feed 💔</p>
        } @else {
          @for (post of posts(); track post.id) {
            <app-post class="post" [post]="post" />
          }
        }
      </main>
    </div>
  `,
  styles: [
    `
      .page {
        padding-inline: 3rem;
      }

      .post {
        background: white;
        transition: box-shadow 0.1s ease-in;
      }

      .post:hover {
        box-shadow: 1px 1px 3px #aaa;
      }

      .post,
      .post {
        margin-top: 2rem;
      }
    `,
  ],
  imports: [PostComponent],
})
export default class HomeComponent {
  pending = signal(true)
  error = signal('')

  posts = toSignal(
    injectLoad<typeof load>().pipe(
      tap(() => this.pending.set(false)),
      catchError((error) => {
        this.error.set(error.message)
        return EMPTY
      }),
    ),
    { requireSync: true },
  )
}
