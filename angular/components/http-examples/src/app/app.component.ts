import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Post } from './post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  post: Post;
  postText: string;

  constructor(private http: HttpClient) {}

  getPost() {
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    const options: any = { observe: 'response' };

    this.http.get<Post>(url, options).subscribe(
      (response: HttpResponse<Post>) => {
        console.log(response);
        console.log(response.headers.get('expires'));
        this.post = response.body;
      }
    );
  }

  async getPostAsync() {
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    this.post = await this.http.get<Post>(url).toPromise();
  }

  getPostAsText() {
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    const options: any = {
      observe: 'response',
      responseType: 'text'
    };

    this.http.get<string>(url, options).subscribe(
      (response: HttpResponse<string>) => {
        console.log(response);
        this.postText = response.body;
      }
    );
  }
}
