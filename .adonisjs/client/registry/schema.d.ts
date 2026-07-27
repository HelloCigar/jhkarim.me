/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'drive.fs.serve': {
    methods: ["GET","HEAD"]
    pattern: '/uploads/*'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { '*': ParamValue[] }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['index']>>>
    }
  }
  'blog.globe': {
    methods: ["GET","HEAD"]
    pattern: '/globe'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['globe']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['globe']>>>
    }
  }
  'blog.show': {
    methods: ["GET","HEAD"]
    pattern: '/articles/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['show']>>>
    }
  }
  'uploads.index': {
    methods: ["GET","HEAD"]
    pattern: '/photos'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['index']>>>
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'admin.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['index']>>>
    }
  }
  'articles.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/articles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/article').listArticleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'articles.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/articles/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['create']>>>
    }
  }
  'articles.store': {
    methods: ["POST"]
    pattern: '/admin/articles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/article').createArticleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/article').createArticleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'articles.show': {
    methods: ["GET","HEAD"]
    pattern: '/admin/articles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['show']>>>
    }
  }
  'articles.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/articles/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['edit']>>>
    }
  }
  'articles.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/articles/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/article').updateArticleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/article').updateArticleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'articles.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/articles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/articles_controller').default['destroy']>>>
    }
  }
  'uploads.store': {
    methods: ["POST"]
    pattern: '/admin/uploads'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/upload').imageUploadValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/upload').imageUploadValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'geocoding.search': {
    methods: ["GET","HEAD"]
    pattern: '/admin/geocode'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/geocoding').geocodeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/geocoding_controller').default['search']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/geocoding_controller').default['search']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
