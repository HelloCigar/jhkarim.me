/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'drive.fs.serve': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/*',
    tokens: [{"old":"/uploads/*","type":0,"val":"uploads","end":""},{"old":"/uploads/*","type":2,"val":"*","end":""}],
    types: placeholder as Registry['drive.fs.serve']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'blog.globe': {
    methods: ["GET","HEAD"],
    pattern: '/globe',
    tokens: [{"old":"/globe","type":0,"val":"globe","end":""}],
    types: placeholder as Registry['blog.globe']['types'],
  },
  'blog.show': {
    methods: ["GET","HEAD"],
    pattern: '/articles/:slug',
    tokens: [{"old":"/articles/:slug","type":0,"val":"articles","end":""},{"old":"/articles/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['blog.show']['types'],
  },
  'uploads.index': {
    methods: ["GET","HEAD"],
    pattern: '/photos',
    tokens: [{"old":"/photos","type":0,"val":"photos","end":""}],
    types: placeholder as Registry['uploads.index']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'admin.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin',
    tokens: [{"old":"/admin","type":0,"val":"admin","end":""}],
    types: placeholder as Registry['admin.index']['types'],
  },
  'articles.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/articles',
    tokens: [{"old":"/admin/articles","type":0,"val":"admin","end":""},{"old":"/admin/articles","type":0,"val":"articles","end":""}],
    types: placeholder as Registry['articles.index']['types'],
  },
  'articles.create': {
    methods: ["GET","HEAD"],
    pattern: '/admin/articles/create',
    tokens: [{"old":"/admin/articles/create","type":0,"val":"admin","end":""},{"old":"/admin/articles/create","type":0,"val":"articles","end":""},{"old":"/admin/articles/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['articles.create']['types'],
  },
  'articles.store': {
    methods: ["POST"],
    pattern: '/admin/articles',
    tokens: [{"old":"/admin/articles","type":0,"val":"admin","end":""},{"old":"/admin/articles","type":0,"val":"articles","end":""}],
    types: placeholder as Registry['articles.store']['types'],
  },
  'articles.show': {
    methods: ["GET","HEAD"],
    pattern: '/admin/articles/:id',
    tokens: [{"old":"/admin/articles/:id","type":0,"val":"admin","end":""},{"old":"/admin/articles/:id","type":0,"val":"articles","end":""},{"old":"/admin/articles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['articles.show']['types'],
  },
  'articles.edit': {
    methods: ["GET","HEAD"],
    pattern: '/admin/articles/:id/edit',
    tokens: [{"old":"/admin/articles/:id/edit","type":0,"val":"admin","end":""},{"old":"/admin/articles/:id/edit","type":0,"val":"articles","end":""},{"old":"/admin/articles/:id/edit","type":1,"val":"id","end":""},{"old":"/admin/articles/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['articles.edit']['types'],
  },
  'articles.update': {
    methods: ["PUT","PATCH"],
    pattern: '/admin/articles/:id',
    tokens: [{"old":"/admin/articles/:id","type":0,"val":"admin","end":""},{"old":"/admin/articles/:id","type":0,"val":"articles","end":""},{"old":"/admin/articles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['articles.update']['types'],
  },
  'articles.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/articles/:id',
    tokens: [{"old":"/admin/articles/:id","type":0,"val":"admin","end":""},{"old":"/admin/articles/:id","type":0,"val":"articles","end":""},{"old":"/admin/articles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['articles.destroy']['types'],
  },
  'uploads.store': {
    methods: ["POST"],
    pattern: '/admin/uploads',
    tokens: [{"old":"/admin/uploads","type":0,"val":"admin","end":""},{"old":"/admin/uploads","type":0,"val":"uploads","end":""}],
    types: placeholder as Registry['uploads.store']['types'],
  },
  'geocoding.search': {
    methods: ["GET","HEAD"],
    pattern: '/admin/geocode',
    tokens: [{"old":"/admin/geocode","type":0,"val":"admin","end":""},{"old":"/admin/geocode","type":0,"val":"geocode","end":""}],
    types: placeholder as Registry['geocoding.search']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
