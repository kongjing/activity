/**
 * Created by asus on 2017/8/17.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { UserService } from '../../user.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-forget',
  templateUrl: './forgetPassword.component.html',
})

export class ForgetPasswordComponent implements OnInit {
  serverCode;
  phone;
  timer = 60;
  hasCode: Boolean = false;

  // form
  ForgetPas = {
    phone: null,
    code: null,
    password: null
  };

  constructor(
    private store: Store<any>, public snackBar: MdSnackBar,
    private router: Router, private route: ActivatedRoute, private userService: UserService) { }
  ngOnInit() {

  }
  home() {
    this.store.select('router').subscribe((x: any) => {
      this.router.navigate([x.url]);
    });
  }
  confirm() {
    if (this.ForgetPas.phone && this.ForgetPas.password) {
      if (this.ForgetPas.code === this.serverCode) {
        this.userService.updatePassword({ phone: this.ForgetPas.phone, password: this.ForgetPas.password }).subscribe(() => {
          this.snackBar.open('修改成功,即将前往登录页面');
          setTimeout(() => {
            this.snackBar.dismiss();
            this.router.navigate(['/user/login']);
          }, 1500);
        }, error => this.errorHandle(error));
      } else {
        this.snackBar.open('验证码错误');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      }
    } else {
      this.snackBar.open('请按要求填写，ok？');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    }
  }

  getMessage() {
    this.hasCode = true;
    const timer = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.hasCode = false;
        this.timer = 60;
        clearInterval(timer);
      }
    }, 1000);
    this.userService.validatePhoneIsExist(this.ForgetPas.phone).subscribe(user => {
      if (user.id) {
        clearInterval(timer);
        let timer0;
        if (this.ForgetPas.phone) {
          this.userService.getForgetMessage(this.ForgetPas.phone).subscribe((data: string) => {
            this.serverCode = data.toString();
          }, error => this.errorHandle(error));
          this.hasCode = true;
          timer0 = setInterval(() => {
            this.timer--;
            if (this.timer === 0) {
              this.hasCode = false;
              this.timer = 60;
              clearInterval(timer0);
            }
          }, 1000);
        } else {
          clearInterval(timer0);
          this.snackBar.open('请输入手机号');
          setTimeout(() => {
            this.snackBar.dismiss();
          }, 1500);
        }
      } else {
        this.snackBar.open('手机号不存在');
        this.hasCode = false;
        this.timer = 60;
        clearInterval(timer);
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      }
    }, error => this.errorHandle(error));
  }
  errorHandle(error) {
    if (error.status === 401) {
      this.snackBar.open('认证失败，请登录先');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (error.status === 403) {
      this.snackBar.open('对不起，您暂无权限');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (error.status === 500) {
      this.snackBar.open('操作失败', '请重试');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    }
  }
}
