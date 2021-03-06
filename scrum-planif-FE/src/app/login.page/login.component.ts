import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenTool } from '../auth.service/token.tool';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl: string;
  submitLabel: string;

  authForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {

    this.authForm = fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3)]) ]
    });
    this.authFormSubmiting(false);

    // TODO : what happen if connected in this page
  }

  authFormSubmiting(authFormSubmiting: boolean) {
    if (authFormSubmiting) {
      this.submitLabel = "En cours..."
    } else {
      this.submitLabel = "Entrer"
    }
  }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('no-user');

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if(this.authForm.valid) {
      this.authForm.disable();
      this.authFormSubmiting(true);
      this.authService.start(this.authForm.controls.name.value).subscribe(
        (authResult) => {
            this.authService.announceUser(TokenTool.decodeToken(authResult.token))
            this.authForm.enable();
            this.authFormSubmiting(false);
            // login successful so redirect to return url
            this.router.navigateByUrl(this.returnUrl);
        },
        err => {
          this.authForm.enable();
          this.authFormSubmiting(false);
          if (err.status == 400) {

            if (err.error.name) {
                this.authForm.controls.name.markAsDirty();
                this.authForm.controls.name.setErrors({'server': err.error.name});
            }
          } else {
              throw err;
          }
        }
      );
    }
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('no-user');
  }
}
