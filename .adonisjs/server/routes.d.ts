import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'blog.globe': { paramsTuple?: []; params?: {} }
    'blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'uploads.index': { paramsTuple?: []; params?: {} }
    'send_newsletters.subscribe': { paramsTuple?: []; params?: {} }
    'send_newsletters.unsubscribe': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.index': { paramsTuple?: []; params?: {} }
    'articles.index': { paramsTuple?: []; params?: {} }
    'articles.create': { paramsTuple?: []; params?: {} }
    'articles.store': { paramsTuple?: []; params?: {} }
    'articles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'articles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'articles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'articles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uploads.store': { paramsTuple?: []; params?: {} }
    'geocoding.search': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'blog.globe': { paramsTuple?: []; params?: {} }
    'blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'uploads.index': { paramsTuple?: []; params?: {} }
    'send_newsletters.subscribe': { paramsTuple?: []; params?: {} }
    'send_newsletters.unsubscribe': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.index': { paramsTuple?: []; params?: {} }
    'articles.index': { paramsTuple?: []; params?: {} }
    'articles.create': { paramsTuple?: []; params?: {} }
    'articles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'articles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'geocoding.search': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'blog.globe': { paramsTuple?: []; params?: {} }
    'blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'uploads.index': { paramsTuple?: []; params?: {} }
    'send_newsletters.subscribe': { paramsTuple?: []; params?: {} }
    'send_newsletters.unsubscribe': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.index': { paramsTuple?: []; params?: {} }
    'articles.index': { paramsTuple?: []; params?: {} }
    'articles.create': { paramsTuple?: []; params?: {} }
    'articles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'articles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'geocoding.search': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'articles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'articles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'articles.store': { paramsTuple?: []; params?: {} }
    'uploads.store': { paramsTuple?: []; params?: {} }
  }
  OPTIONS: {
  }
  PATCH: {
    'articles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}