import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, NewQuestion, TestPreview, SaveTestRequest } from "../DTOs/DTOs"

@Injectable({
  providedIn: 'root',
})
export class Api {

  private baseUrl = 'https://localhost:7178';

  constructor(private http: HttpClient) {}

  addQuestion(question : NewQuestion)
  {
    return this.http.post<{ message: string }>(`${this.baseUrl}/AddQuestion`, question, {
      withCredentials : true
    });
  }

  getAllCategories()
  {
    return this.http.get<Category[]>(`${this.baseUrl}/GetAllCategories`, {
      withCredentials : true
    });
  }

  postCategory(category: { name: string })
  {
    return this.http.post<Category>(`${this.baseUrl}/PostCategory`, category, {
      withCredentials : true
    });
  }

  getTestPreview(categoryId : number)
  {
    return this.http.get<TestPreview>(`${this.baseUrl}/GetTestPreview`, {
      params: { categoryId: categoryId },
      withCredentials : true
    });
  }

 saveTest(request: SaveTestRequest) {
  return this.http.post<string>(
    `${this.baseUrl}/SaveTest`,
    request,
    { withCredentials: true }
  );
}

getTest(guid: string) {
  return this.http.get<any>(`${this.baseUrl}/GetTest`, {
    params : {guid : guid},
    withCredentials : true
    });
}


}
