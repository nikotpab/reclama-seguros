import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api';


  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  verifyUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/verify`, data);
  }

  createConsultation(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/consultations/create`, data);
  }

  getConsultationsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/consultations/user/${userId}`);
  }

  getConsultationDetail(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/consultations/${id}`);
  }


  uploadSignature(id: number, signatureBase64: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/consultations/${id}/sign`, { base64Signature: signatureBase64 });
  }

  processPayment(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/consultations/${id}/pay`, {});
  }


  uploadDocument(id: number, type: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post(`${this.baseUrl}/consultations/${id}/upload`, formData);
  }

  signMandate(id: number, signatureBase64: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/consultations/${id}/sign-mandate`, { base64Signature: signatureBase64 });
  }

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/stats`);
  }

  getAllConsultations(page: number = 0): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/consultations?page=${page}&size=10`);
  }

  getAdminConsultationDetail(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/consultations/${id}`);
  }

  updateConsultationStatus(id: number, payload: any): Observable<any> {
    const body = typeof payload === 'string' ? { status: payload } : payload;
    return this.http.put(`${this.baseUrl}/admin/consultations/${id}/status`, body);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/reset-password`, data);
  }
}