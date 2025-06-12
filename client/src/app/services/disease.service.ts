// src/app/services/disease.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DiseaseResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class DiseaseService {
  private aiUrl = environment.aiModelUrl;

  constructor(private http: HttpClient) {}

  predictDisease(file: File, crop: string) {
    const form = new FormData();
    form.append('file', file);
    form.append('crop', crop);

    return this.http.post<DiseaseResponse>(
      `${this.aiUrl}/predict-disease`,
      form
    );
  }
}
