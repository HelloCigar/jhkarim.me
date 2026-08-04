import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import string from '@adonisjs/core/helpers/string'
import { urlFor } from '@adonisjs/core/services/url_builder'

export default class GithubOauthsController {
  async redirect({ ally, session }: HttpContext) {
    session.put('redirect.previousUrl', urlFor('session.create'))
    return ally.use('github').redirect()
  }

  async callback({ auth, ally, response }: HttpContext) {
    const github = ally.use('github')
    const githubUser = await github.user()

    if (github.accessDenied()) {
      return response.redirect().toRoute('session.create', {
        error: 'Unauthorized account',
      })
    }

    const user = await User.findBy('email', githubUser.email)

    // accounts are created thru cli so deny users not in db
    if (!user) {
      return response.redirect().toRoute('session.create', {
        error: 'Unauthorized account',
      })
    }

    // save user to db
    await user
      .merge({
        email: githubUser.email,
        fullName: githubUser.name,
        password: string.uuid(),
      })
      .save()

    /**
     * Create a session for the user
     */
    await auth.use('web').login(user)

    /**
     * Redirect to the page the user was trying to access,
     * or /dashboard if no intended URL was stored
     */
    return response.redirect().toRoute('admin.index')
  }
}
