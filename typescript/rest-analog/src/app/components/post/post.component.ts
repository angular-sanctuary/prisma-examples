import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { Post } from '../../models/post.model'

@Component({
  selector: 'app-post',
  standalone: true,
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  post = input.required<Post>()
}
