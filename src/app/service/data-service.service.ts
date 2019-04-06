import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Post } from "../module/post";

///import BehaviorSubject and Observable///
import { Observable, BehaviorSubject } from "rxjs";
///////////////////////////////

@Injectable()
export class DataService {
  readonly ROOT_URL = "https://jsonplaceholder.typicode.com";

  posts;
  newPost;

  ////////////////////////////////////////////////////////////
  //create new BehaviorSubject of type and give it a value
  private isLoaded = new BehaviorSubject<boolean>(false);

  //create public variable to get hold of its value from outsite this service
  loaded = this.isLoaded.asObservable();

  ////////////////////////////////////////////////////////////

  constructor(private http: HttpClient) {}

  getPosts(userId) {
    let params = new HttpParams().set("userId", userId);
    //if need auth-->
    let headers = new HttpHeaders().set("Authorization", "auth-token");

    this.isLoaded.next(false);

    this.http
      .get<Post[]>(this.ROOT_URL + "/posts", { params, headers })
      .subscribe(data => {
        this.posts = data;

        //inside the subscribe when its done it sends TRUE
        this.isLoaded.next(true);
      });
  }

  createPost() {
    //send the data we want to post to the server
    const data: Post = {
      id: null,
      userId: 23,
      title: "My New Post",
      body: "Hello World!"
    };
    //and then sending the data with post request
    this.newPost = this.http
      .post(this.ROOT_URL + "/posts", data)
      // TODO: Update catch to catchError
      /* .retry(3)
      .catch(err => {
        console.log(err);
        return Observable.of(err);
      }); */
  }
}
