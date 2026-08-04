/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  home: typeof routes['home']
  blog: {
    globe: typeof routes['blog.globe']
    show: typeof routes['blog.show']
  }
  uploads: {
    index: typeof routes['uploads.index']
    store: typeof routes['uploads.store']
  }
  sendNewsletters: {
    subscribe: typeof routes['send_newsletters.subscribe']
    unsubscribe: typeof routes['send_newsletters.unsubscribe']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  githubOauths: {
    redirect: typeof routes['github_oauths.redirect']
    callback: typeof routes['github_oauths.callback']
  }
  admin: {
    index: typeof routes['admin.index']
  }
  articles: {
    index: typeof routes['articles.index']
    create: typeof routes['articles.create']
    store: typeof routes['articles.store']
    show: typeof routes['articles.show']
    edit: typeof routes['articles.edit']
    update: typeof routes['articles.update']
    destroy: typeof routes['articles.destroy']
  }
  geocoding: {
    search: typeof routes['geocoding.search']
  }
}
