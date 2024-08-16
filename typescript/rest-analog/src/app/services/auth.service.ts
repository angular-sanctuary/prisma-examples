import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient)

  signup(name: string, email: string) {
    return this.#http.post('/api/user', { name, email })
  }

  findAuthor(email: string) {
    return this.#http.post(`/api/author`, { email })
  }
}
