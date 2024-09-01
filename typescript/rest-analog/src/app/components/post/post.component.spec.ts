import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PostComponent } from './post.component'

describe('PostComponent', () => {
  let component: PostComponent
  let fixture: ComponentFixture<PostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PostComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    fixture.componentRef.setInput('post', {
      id: 1,
      title: 'title',
      content: 'content',
      author: {
        name: 'Gerome',
      },
    })

    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
