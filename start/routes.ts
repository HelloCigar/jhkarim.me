/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

/**
 * Public blog pages
 */
router.get('/', [controllers.Blog, 'index']).as('home')
router.get('/globe', [controllers.Blog, 'globe'])
router.get('/articles/:slug', [controllers.Blog, 'show']).where('slug', router.matchers.slug())
router.get('/photos', [controllers.Uploads, 'index'])
router.get('/subcribe', [controllers.SendNewsletters, 'subscribe'])
router.get('/unsubcribe/:id', [controllers.SendNewsletters, 'unsubscribe'])

/**
 * There is no self signup: the only account is the admin created
 * with the "node ace make:admin" command.
 */
router
  .group(() => {
    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])

    //oauth
    router.get('/github/redirect', [controllers.GithubOauths, 'redirect'])
    router.get('/oauth/github/callback', [controllers.GithubOauths, 'callback'])
  })
  .use(middleware.guest())

/**
 * Admin area
 */
router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
    router.get('admin', [controllers.Admin, 'index'])
    router.resource('admin/articles', controllers.Articles).as('articles')
    router.post('admin/uploads', [controllers.Uploads, 'store'])
    router.get('admin/geocode', [controllers.Geocoding, 'search'])
  })
  .use(middleware.auth())
