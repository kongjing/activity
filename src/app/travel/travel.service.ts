import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Common } from '../shared/Common';
import { CookieService } from '../shared/lib/ngx-cookie/cookie.service';


@Injectable()
export class TravelService {
    HttpUrl = Common.HttpUrl;

    constructor(private cookieService: CookieService, private http: Http) {
    }

    private setOptions(): RequestOptions {
        const headers = new Headers();
        headers.append('Authorization', this.cookieService.get('token'));
        return new RequestOptions({ headers: headers });
    }

    select(userId: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('userId', userId);
        return this.http.post(this.HttpUrl + '/user/select', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    insert(params: any, content: any, userID: any, articleType: any, schoolId: any, imageList: any): Observable<any> {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('title', params.title);
        urlSearchParams.append('address', params.address);
        urlSearchParams.append('content', content);
        urlSearchParams.append('userID', userID);
        urlSearchParams.append('articleType', articleType);
        urlSearchParams.append('schoolId', schoolId);
        urlSearchParams.append('imageList', imageList);
        return this.http.post(this.HttpUrl + '/article/insert', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    support(id: any, userID: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        urlSearchParams.append('userID', userID);
        return this.http.post(this.HttpUrl + '/article/support', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    comment(id: any, userID: any, comment: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        urlSearchParams.append('userID', userID);
        urlSearchParams.append('comment', comment);
        return this.http.post(this.HttpUrl + '/article/comment', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    childComment(parentCommentID: any, articleID: any, userID: any, comment: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('parentCommentID', parentCommentID);
        urlSearchParams.append('articleID', articleID);
        urlSearchParams.append('userID', userID);
        urlSearchParams.append('comment', comment);
        return this.http.post(this.HttpUrl + '/article/childComment', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    logout() {
        return this.http.post(this.HttpUrl + '/auth/logout', {}, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    unSupport(id: any, userID: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        urlSearchParams.append('userID', userID);
        return this.http.post(this.HttpUrl + '/article/unSupport', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }
    read(id: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        return this.http.post(this.HttpUrl + '/article/read', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getArticleByIdWithUser(id: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        return this.http.post(this.HttpUrl + '/article/getArticleByIdWithUser', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAllCommentByArticleId(id: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        return this.http.post(this.HttpUrl + '/article/getAllCommentByArticleId', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getArticleByPage(page: any, type: any, isLogin: any, userID: any): Observable<any> {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('startPage', page);
        urlSearchParams.append('articleType', type);
        urlSearchParams.append('isLogin', isLogin);
        urlSearchParams.append('userID', userID);
        return this.http.post(this.HttpUrl + '/article/getArticleByPage', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getArticleByPageAndTitleAndType(val: any, page: any, type: any, isLogin: any, userID: any): Observable<any> {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('title', val);
        urlSearchParams.append('startPage', page);
        urlSearchParams.append('articleType', type);
        urlSearchParams.append('isLogin', isLogin);
        urlSearchParams.append('userID', userID);
        return this.http.post(this.HttpUrl + '/article/getArticleByPageAndTitleAndType', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }
    getArticleSupportByUserIdAndArticleID(userID: any, articleID: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('articleID', articleID);
        urlSearchParams.append('userID', userID);
        return this.http.post(this.HttpUrl + '/article/getArticleSupportByUserIdAndArticleID', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }
    getUnReadArticleSupportByUserIDAndArticleType(userID: any, articleType: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('userID', userID);
        urlSearchParams.append('articleType', articleType);
        return this.http.post(this.HttpUrl + '/article/getUnReadArticleSupportByUserIDAndArticleType', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }
    getUnReadArticleCommentByUserIDAndArticleType(userID: any, articleType: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('userID', userID);
        urlSearchParams.append('articleType', articleType);
        return this.http.post(this.HttpUrl + '/article/getUnReadArticleCommentByUserIDAndArticleType', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getArticleImageByArticleId(articleID: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('articleID', articleID);
        return this.http.post(this.HttpUrl + '/article/getArticleImageByArticleId', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }
    signature(jsapi_ticket: any, url: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('jsapi_ticket', jsapi_ticket);
        urlSearchParams.append('url', url);
        return this.http.post(this.HttpUrl +
            '/user/signature', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }
    extractData(res: Response) {
        if (res.text()) {
            return res.json() || [];
        }
        return [];
    }

    handleError(error: Response | any) {
        return Observable.throw(error);
    }
}
