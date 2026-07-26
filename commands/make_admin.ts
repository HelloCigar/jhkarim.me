import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeAdmin extends BaseCommand {
  static commandName = 'make:admin'
  static description = 'Create the admin account used to author the blog'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.string({ description: 'Full name of the admin' })
  declare fullName?: string

  @flags.string({ description: 'Email address of the admin' })
  declare email?: string

  @flags.string({ description: 'Password of the admin (prompted when omitted)' })
  declare password?: string

  async run() {
    const { default: User } = await import('#models/user')

    const fullName = this.fullName ?? (await this.prompt.ask('Full name'))
    const email =
      this.email ??
      (await this.prompt.ask('Email', {
        validate: (value) => (value.includes('@') ? true : 'Enter a valid email address'),
      }))

    const existing = await User.findBy('email', email)
    if (existing) {
      this.logger.error(`An account with the email "${email}" already exists`)
      this.exitCode = 1
      return
    }

    const password =
      this.password ??
      (await this.prompt.secure('Password', {
        validate: (value) => (value.length >= 8 ? true : 'Password must be at least 8 characters'),
      }))

    const user = await User.create({ fullName, email, password })
    this.logger.success(`Admin account created for ${user.email}`)
  }
}
