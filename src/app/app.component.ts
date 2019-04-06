import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Post } from "./module/post";
import { DataService } from "./service/data-service.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  loaded: boolean = false;
  posts;
  newPost;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getPosts("3");

    //sync -- > check when loaded is giving us just then update other stuff

    this.dataService.loaded.subscribe(value => {
      (this.loaded = value), (this.posts = this.dataService.posts);
    });
  }
  ////////////////////////////////////////////////////

  getPosts(UserId) {
    this.dataService.getPosts(UserId);

    this.posts = this.dataService.posts;
  }

  createPost() {
    this.newPost = this.dataService.createPost();
  }
}
