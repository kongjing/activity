/**
 * Created by asus on 2017/8/15.
 */

import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, } from '@angular/forms';
import { Common } from '../shared/Common';
import { ActivityService } from './activity.service';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';
declare var $;
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-activity-add',
  templateUrl: './activityAdd.component.html',
})

export class ActivityAddComponent implements OnInit, AfterViewInit, OnDestroy {
  user;
  schoolId;
  HttpUrl = Common.HttpUrl;
  ActivityUrl = Common.ActivityUpload;
  activityType;
  content;
  startTime;
  endTime;
  elementRef: ElementRef;
  imageList = [];
  showSpinner = false;
  label: String = '';
  labelList: Array<any> = [];
  now = new Date();
  disableCommit = false;
  // form
  activity = {
    title: null,
    address: null,
    publishUserContact: null
  };

  en = {
    firstDayOfWeek: 0,
    dayNames: ['日', '一', '二', '三', '四', '五', '六'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月',
      '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
  };
  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  storeSubscribe: Subscription;
  routerSubscribe: Subscription;
  @ViewChild('starttimeTemplate') starttimeTemplate: ElementRef;
  @ViewChild('endtimeTemplate') endtimeTemplate: ElementRef;

  ActivityUpload = Common.ActivityUpload;
  constructor( @Inject(ElementRef) elementRef: ElementRef, public snackBar: MatSnackBar,
    public meta: Meta, public title: Title, private store: Store<any>, private location: Location,
    private activityService: ActivityService, private router: Router,
    private route: ActivatedRoute, private renderer: Renderer) {
    this.elementRef = elementRef;
    this.title.setTitle('发布活动');
    this.meta.addTags([
      { name: 'keywords', content: '大学生活动发布' },
      { name: 'description', content: '大学生活动发布平台中心' }
    ]);
  }

  ngAfterViewInit(): void {
    $('#summernote').summernote({
      height: 200,
      toolbar: [
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['fontsize', ['fontsize']],
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['insert', ['picture']]
      ],
      callbacks: {
        onImageUpload: (files) => {
          this.sendFile(files[0]);
        },
      },
      dialogsInBody: true,
      dialogsFade: true,
      placeholder: '活动简介'
    });
    for (let i = 0; i < this.elementRef.nativeElement.querySelectorAll('.owl-timer-text').length; i++) {
      this.renderer.setElementStyle(this.elementRef.nativeElement.querySelectorAll('.owl-timer-text')[i], 'height', 'auto');
      this.renderer.setElementStyle(this.elementRef.nativeElement.querySelectorAll('.owl-timer-text')[i], 'width', '120%');
    }
    this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn')[0].innerText = '确认';
    this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn')[1].innerText = '关闭';
    this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn')[2].innerText = '确认';
    this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn')[3].innerText = '关闭';
    for (let i = 0; i < this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn').length; i++) {
      this.renderer.setElementStyle(this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn')[i], 'height', 'auto');
      this.renderer.setElementStyle(this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn')[i], 'width', '50%');
      this.renderer.setElementStyle(this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn')[i], 'margin', '0 auto');
      this.renderer.setElementStyle(this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn')[i], 'background-color', '#9e9d9d');
      this.renderer.setElementStyle(this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn')[i], 'border-right-color', 'white');
      this.renderer.setElementStyle(this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn')[i], 'border-right-width', '1px');
      this.renderer.setElementStyle(this.elementRef.nativeElement.querySelectorAll('.owl-dateTime-btn')[i], 'border-left-color', 'white');
    }
  }
  sendFile(file: any) {
    const data = new FormData();
    data.append('image', file);
    $.ajax({
      data: data,
      type: 'POST',
      url: this.ActivityUpload,
      cache: false,
      contentType: false,
      processData: false,
      success: function (url) {
        $('#summernote').summernote('insertImage', url, function ($image) {
          $image.css('width', '100%');
          $image.attr('data-filename', 'retriever');
        });
      }
    });
  }

  ngOnInit() {
    this.routerSubscribe = this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.activityType = params.id;
      } else {
        this.router.navigate(['/404']);
      }
    });
    this.storeSubscribe = this.store.select('user').subscribe(data => {
      this.user = data;
    });
  }

  imageUploaded(e) {
    this.imageList.push(
      e.serverResponse.text()
    );
  }

  imageRemoved(e) {
    for (let i = 0; i < this.imageList.length; i++) {
      if (this.imageList[i] === e.serverResponse.text()) {
        this.imageList.splice(i, 1);
        break;
      }
    }
  }

  commit() {
    if (this.activity.title && this.activity.publishUserContact &&
      this.startTime && this.endTime) {
      this.showSpinner = true;
      this.disableCommit = true;
      if (this.user.user.id) {
        this.schoolId = this.user.user.schoolId;
        for (let i = 0; i < this.imageList.length; i++) {
          this.imageList[i] = '\"' + this.imageList[i] + '\"';
        }
        this.content = $('#summernote').summernote('code');
        this.activityService.insert(this.activity, this.startTime, this.endTime,
          this.content, this.user.user.id, this.activityType, this.schoolId, [this.imageList]).subscribe(data => {
            this.router.navigate(['../list'], { relativeTo: this.route });
          }, error => {
            this.showSpinner = false;
            this.disableCommit = false;

            this.errorHandle(error);
          });
      } else {
        alert('登陆超时，请重新登录');
      }
    }
  }

  back() {
    this.location.back();
  }
  home() {
    this.router.navigate(['/activity']);
  }

  ngOnDestroy() {
    this.storeSubscribe.unsubscribe();
    this.routerSubscribe.unsubscribe();
  }

  errorHandle(error) {
    if (error.status === 401) {
      this.snackBar.open('认证失败，请登陆先');
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
