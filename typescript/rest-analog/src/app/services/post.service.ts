import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient)

  createDraft(title: string, authorEmail: string, content: string) {
    return this.#http.post('/api/post', { title, authorEmail, content })
  }

  publish(id: number) {
    return this.#http.put(`/api/publish/${id}`, {})
  }

  destroy(id: number) {
    return this.#http.delete(`/api/post/${id}`)
  }
}
