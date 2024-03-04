import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, effect, inject, signal } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { Observable } from "rxjs";
import { UserStorageInfo } from "../models/user-storage-info"; 

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private http = inject(HttpClient);
    private urlApi = `${environment.urlApi}`;
    private userInfo = signal<UserStorageInfo | null>(null);

    constructor() {
        effect(() => this.SyncUserInfoLocalStorage());
    }
    
    LoginUser(loginData: {  Email: string; Password: string;}) : Observable<any> {
        return this.http.post<any>(`${this.urlApi}/user/login`,  loginData);
    }
   
    RegisterUser(RegisterUser: {Name: string; Lastname: string; Email: string; Password: string;}) : Observable<any> {
        return this.http.post<any>(`${this.urlApi}/user`, RegisterUser);
    }
    UpdateUser(UpdateUser: {Name: string; Lastname: string; Email: string; Password: string;}, token:string) : Observable<any> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.put<any>(`${this.urlApi}/user`, UpdateUser, { headers });
    }

    GetUser(token: string) {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<any>(`${this.urlApi}/user`, { headers });
    }
    DeleteUser(token: string) {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.delete<any>(`${this.urlApi}/user`, { headers });
    }

    SetCurrentUser(user: UserStorageInfo) { this.userInfo.set(user);}
    SyncUserInfoLocalStorage() {    localStorage.setItem('UserData', JSON.stringify(this.userInfo()));}
    isUserLogged() {    return !!this.userInfo();}
    
    GetUserInfoSignal() {
        return this.userInfo.asReadonly();
    }
    TrySyncLocalStorage(){
        const localStorageData = localStorage.getItem('UserData');

        if(!localStorageData)
            return;
        
        const userData: UserStorageInfo = JSON.parse(localStorageData);
        this.userInfo.set(userData);
    }
    Logout() {
        localStorage.removeItem('UserData');
        this.userInfo.set(null);
    }

}