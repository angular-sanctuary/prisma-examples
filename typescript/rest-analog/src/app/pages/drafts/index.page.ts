import { Component, signal } from '@angular/core'
import { PostComponent } from '../../components/post/post.component'
import { load } from './index.server'
import { toSignal } from '@angular/core/rxjs-interop'
import { injectLoad } from '@analogjs/router'
import { RouterLink } from '@angular/router'
import { catchError, EMPTY, tap } from 'rxjs'

@Component({
  selector: 'app-drafts',
  standalone: true,
  template: `
    <div class="page">
      <h1>Drafts</h1>
      <main>
        @if (pending()) {
          <p>
            <span class="loading"></span>
          </p>
        } @else if (error()) {
          <p>Error while fetching feed 💔</p>
        } @else {
          <ul class="post-list">
            @for (post of posts(); track post.id) {
              <li>
                <a [routerLink]="['/post', post.id]">
                  <app-post [post]="post" />
                </a>
              </li>
            }
          </ul>
        }
      </main>
    </div>
  `,
  styles: [
    `
      .page {
        padding-inline: 2rem;
      }

      .post-list {
        list-style-type: none;
        padding: 0;
        display: grid;
        gap: 1rem;
      }

      a {
        color: inherit;
        text-decoration: none;
      }
    `,
  ],
  imports: [PostComponent, RouterLink],
})
export default class DraftsComponent {
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
