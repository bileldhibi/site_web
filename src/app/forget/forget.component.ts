import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {

  email:string='';

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
  }
  forget(){
    this.auth.forget(this.email);
    this.email='';
  }

}
