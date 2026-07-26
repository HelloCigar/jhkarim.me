import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'articles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable().unsigned().references('users.id')
      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.string('excerpt').nullable()
      table.text('content').notNullable().defaultTo('')
      table.string('cover_image').nullable()
      table.string('location_name').nullable()
      table.double('latitude').nullable()
      table.double('longitude').nullable()
      table.timestamp('published_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
