import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

type ImageOptions = {
  eye: "NoEye" | "HalfOpen" | "Closed" | "Open",
  hasHammer: boolean;
  mouth: "NoMouth" | "Happy" | "Normal" | "Unhappy",
  rightHand: "NoHand" | "Normal" | "Victory",
  hasTail: boolean,
};

type ImageOptionResponse = {
  data: ImageOptions
}

@Component({
  selector: 'app-build',
  standalone: true,
  imports: [RouterModule, FormsModule, JsonPipe],
  templateUrl: './build.component.html',
  styleUrl: './build.component.css'
})

export class BuildComponent {
  eye = signal('Open')
  hasHammeer = signal(false);
  mouth = signal("Normal");
  rightHand = signal("Normal");
  hasTail = signal(false);

  private readonly httpClient = inject(HttpClient);

  async ngOnInit(): Promise<void> {
    const imageOptionResponse = await this.getOptions();
    this.setSignals(imageOptionResponse);
  }

  getOptions(): Promise<ImageOptionResponse> {
    return firstValueFrom(this.httpClient.get<ImageOptionResponse>(
      `http://localhost:5110/get-random-image-options`))
  }

  setSignals(imageOptionResponse: ImageOptionResponse){
    this.eye.set(imageOptionResponse.data.eye);
    this.hasHammeer.set(imageOptionResponse.data.hasHammer);
    this.mouth.set(imageOptionResponse.data.mouth);
    this.rightHand.set(imageOptionResponse.data.rightHand);
    this.hasTail.set(imageOptionResponse.data.hasTail);
  }
}
