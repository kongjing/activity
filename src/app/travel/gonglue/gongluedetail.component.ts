/**
 * Created by asus on 2017/8/15.
 */

import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer, ViewChild } from '@angular/core';
import { TravelService } from '../travel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
declare var $;
import { Meta, Title } from '@angular/platform-browser';
import { Common } from '../../shared/Common';
declare var wx;

@Component({
  selector: 'app-travel-gonglue-detail',
  templateUrl: './gongluedetail.component.html',
})

export class TravelGonglueDetailComponent implements OnInit, OnDestroy {
  newUrl;
  url = Common.Url;
  showSpinner = false;
  showChildSpinner = false;
  imageList = [];
  commentList: any = [];
  user: any;
  comment: any;
  childComment = [];
  isUserSupport = false;
  article = {
    content: '',
    id: '',
    title: '',
    user: {
      name: '',
      headUrl: ''
    },
    readNumber: null,
    commentNumber: null,
    countCommentNumber: null,
    publishTime: null,
    address: null
  };
  galleryOptions = [
    {
      'thumbnails': false, 'preview': false, previewCloseOnClick: true, previewSwipe: true
      , imageArrows: false, 'imageSwipe': true
    },
    { 'breakpoint': 500, 'width': '100%', 'height': '400px' }
  ];

  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  routerSubscribe: Subscription;
  storeSubscribe: Subscription;

  @ViewChild('commitButton') commitButton: ElementRef;
  @ViewChild('commitChildButton') commitChildButton: ElementRef;
  constructor(private store: Store<any>, private renderer: Renderer, public snackBar: MatSnackBar,
    public meta: Meta, public title: Title,
    private location: Location, private travelService: TravelService, private router: Router, private route: ActivatedRoute) {
    this.title.setTitle('旅游详情');
  }

  initWx(title, desc, url, image) {
    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: image, // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        this.snackBar.open('分享成功');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });

    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: image, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        this.snackBar.open('分享成功');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareQQ({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: url, // 分享链接
      imgUrl: image, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        this.snackBar.open('分享成功');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareQZone({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: url, // 分享链接
      imgUrl: image, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        this.snackBar.open('分享成功');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
  }
  ngOnInit() {
    this.initWx('', '', '', 'http://www.ddshidai.com/assets/img/dd_7.jpg');
    this.routerSubscribe = this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.travelService.read(params.id).subscribe();
        this.getAllCommentByArticleId(params.id);

        this.travelService.getArticleByIdWithUser(params.id).subscribe(data => {
          this.article = data;
          this.meta.addTags([
            { name: 'keywords', content: this.article.title },
            { name: 'description', content: this.article.content }
          ]);
          $('#summernote').html(this.article.content);

          this.travelService.getArticleImageByArticleId(params.id).subscribe(imageList => {
            const list = [];
            for (let j = 0; j < imageList.length; j++) {
              list.push({
                medium: imageList[j].url,
              });
            }
            this.imageList = list;
            let image;
            if (this.imageList[0]) {
              image = this.imageList[0].medium;
            } else {
              image = 'http://www.ddshidai.com/assets/img/logo.jpg';
            }
            this.initWx(this.article.title, $('#summernote')[0].innerText, this.newUrl, image);

          });
        }, error => this.errorHandle(error));

        // wx
        this.store.select('wx').subscribe(data1 => {
          if (data1.JsapiTicket) {
            this.newUrl = this.url + '/travel/gonglueDetail?id=' + params.id;
            this.travelService.signature(data1.JsapiTicket,
              this.newUrl).subscribe(data2 => {
                wx.config({
                  // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: 'wx3b6fe19df1feedfa', // 必填，公众号的唯一标识
                  timestamp: data2.timestamp, // 必填，生成签名的时间戳
                  nonceStr: data2.nonceStr, // 必填，生成签名的随机串
                  signature: data2.signature, // 必填，签名，见附录1
                  // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                  jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone']
                });
              });
          }
        });
        this.storeSubscribe = this.store.select('user').subscribe(data => {
          this.user = data;
          if (this.user && this.user.user && this.user.user.id) {
            this.travelService.getArticleSupportByUserIdAndArticleID(this.user.user.id, params.id).subscribe(support => {
              if (!Array.isArray(support)) {
                this.isUserSupport = true;
              }
            });
          }
        });
      } else {
        this.router.navigate(['/404']);
      }
    });
  }

  publish() {
    this.showSpinner = true;
    this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
    if (this.user.isLogin && this.comment) {
      this.travelService.comment(this.article.id, this.user.user.id, this.comment).subscribe(data => {
        this.getAllCommentByArticleId(this.article.id);
        this.comment = '';
        this.article.countCommentNumber++;
        this.showSpinner = false;
      }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      } else {
        this.showSpinner = false;
        this.comment = '';
      }
    }
  }

  childPublish(comment, index) {
    this.showChildSpinner = true;
    this.renderer.setElementAttribute(this.commitChildButton.nativeElement, 'disabled', 'true');
    comment.showChildComment = false;
    if (this.user.isLogin && this.childComment) {
      if (!comment.childrenCommentList) {
        comment.childrenCommentList = [];
      }
      comment.childrenCommentList.unshift({
        comment: this.childComment[index],
        user: {
          name: this.user.user.name,
          headUrl: this.user.user.headUrl
        }
      });
      this.travelService.childComment(comment.id, this.article.id, this.user.user.id, this.childComment[index]).subscribe(data => {
        //  this.getAllCommentByArticleId(this.article.id);
        this.childComment = [];
        this.article.countCommentNumber++;
        this.showChildSpinner = false;
        comment.showChildComment = false;
      }, error => {
        this.showChildSpinner = false;
        this.errorHandle(error);
      });
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      } else {
        this.showChildSpinner = false;
      }
    }
  }

  getAllCommentByArticleId(id) {
    this.travelService.getAllCommentByArticleId(id).subscribe(data => {
      this.commentList = data;
    }, error => this.errorHandle(error));
  }

  back() {
    this.location.back();
  }

  login() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
      }
    });

    this.router.navigate(['/user/login']);
  }

  support(travelGonglue) {
    if (this.user.isLogin) {
      travelGonglue.countSupportNumber++;
      this.isUserSupport = true;
      this.travelService.support(travelGonglue.id, this.user.user.id).subscribe(() => { }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
    }
  }

  unSupport(travelGonglue) {
    if (this.user.isLogin) {
      travelGonglue.countSupportNumber--;
      this.isUserSupport = false;
      this.travelService.unSupport(travelGonglue.id, this.user.user.id).subscribe(() => { }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
    }
  }

  loadMoreChildComment(childComponent) {
    this.router.navigate(['/travel/gonglueComment'], { queryParams: { comment: JSON.stringify(childComponent.childrenCommentList) } });
  }
  home() {
    this.router.navigate(['/travel']);
  }

  gotoPublishPersonDetail(e: any, article: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: article.publishUserId } });
  }

  gotoFirstPersonDetail(e: any, comment: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: comment.userId } });
  }
  gotoChildPersonDetail(e: any, childComment: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: childComment.userId } });
  }
  ngOnDestroy() {
    this.routerSubscribe.unsubscribe();
    this.storeSubscribe.unsubscribe();
  }
  childCommentCancel(e, childComment) {
    e.stopPropagation();
    childComment.showChildComment = false;
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
