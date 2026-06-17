import { Component } from '@angular/core';
import { CreatePostHeader } from '../../../../layout/create-post-header/create-post-header';
import { CreatePostForm } from '../../../../layout/create-post-form/create-post-form';
@Component({
  selector: 'app-create-post',
  standalone:true,
  imports: [CreatePostForm,CreatePostHeader],
  template: ` 
    <main class="create-post-page">
      <app-create-post-header />
      <app-create-post-form />
    </main>
  
  `,
  styleUrl: './create-post.scss',
})
export class CreatePost {
  
}
