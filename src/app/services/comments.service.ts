import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export  class CommentsService {
    private isAtualizeSubject = new BehaviorSubject<boolean>(false);
    isAtualize$ = this.isAtualizeSubject.asObservable();

    private http = inject(HttpClient);
    private urlApi = `${environment.urlApi}`;
    
    constructor() {} 

    GetComments(TaskId: string, token: string) {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get(`${this.urlApi}/comment/${TaskId}`, { headers });
    }

    PostComments( PostComments: {CommentText: string, CommentTaskId: string}, token:string) : Observable<any> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.post<any>(`${this.urlApi}/comment`,  PostComments, { headers });
    }
    
    DeleteComment(CommentId: string, token:string) : Observable<any> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.delete<any>(`${this.urlApi}/comment/${CommentId}`, { headers });
    }

    TickAtualizeTrue() {    this.isAtualizeSubject.next(true);}
}