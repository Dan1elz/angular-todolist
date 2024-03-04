import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export  class TaskService {
    private isAtualizeSubject = new BehaviorSubject<boolean>(false);
    isAtualize$ = this.isAtualizeSubject.asObservable();

    private http = inject(HttpClient);
    private urlApi = `${environment.urlApi}`;
    
    constructor() {} 

    GetTask(token: string): Observable<any> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<any>(`${this.urlApi}/task`, { headers });
    }
    GetTaskOnlyTrue(token: string): Observable<any> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<any>(`${this.urlApi}/task/true`, { headers });
    }

    GetTaskOnlyFalse(token: string) : Observable<any> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<any>(`${this.urlApi}/task/false`, { headers });
    }
    
    PostTasks(PostTasks: {TaskTitle: string, TaskDescription: string, TaskCompleted:boolean}, token:string) : Observable<any> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.post<any>(`${this.urlApi}/task`, PostTasks, { headers });
    }
    DeleteTasks(TaskId: string, token:string) : Observable<any> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.delete<any>(`${this.urlApi}/task/${TaskId}`, { headers });
    }

    EditTasks(EditTask: {TaskId: string, TaskTitle: string, TaskDescription: string, TaskCompleted:boolean}, token:string) : Observable<any> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.put<any>(`${this.urlApi}/task`, EditTask, { headers });
    }
    EditCheckbox(EditTask: {TaskId: string, TaskCompleted: boolean}, token: string) : Observable<any> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.put<any>(`${this.urlApi}/task/checkbox`, EditTask, { headers });
    }

    TickAtualizeTrue() {    this.isAtualizeSubject.next(true);}
}