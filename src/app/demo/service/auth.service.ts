import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/users'; // Replace with your backend API URL for users

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching users:', error);
          throw error; // Rethrow or handle as needed
        })
      );
  }

  addUser(name: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, { name, email })
      .pipe(
        catchError(error => {
          console.error('Error adding user:', error);
          throw error; // Rethrow or handle as needed
        })
      );
  }

  updateUser(id: number, name: string, email: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { name, email })
      .pipe(
        catchError(error => {
          console.error('Error updating user:', error);
          throw error; // Rethrow or handle as needed
        })
      );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting user:', error);
          throw error; // Rethrow or handle as needed
        })
      );
  }

///Get Users Profile Pic
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }

  getProfilePicture(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile-picture`);
  }
}
