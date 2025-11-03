import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Registration } from '../../shared/services/registration';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUp implements OnInit {
  public method = signal('');
  
  private dataService = inject(Registration);

  private methodSet = effect(() => {
    this.dataService.updateData({ method: this.method() });
  });

  public ngOnInit(): void {
    this.dataService.clearData();
  }
}
