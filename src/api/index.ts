import type { IGetParams } from './types'
import type { Article } from '~/types'
import request from '~/request/index'

function urlParamJoin(baseUrl: string, params: Record<string, string>): string {
  const entries = Object.entries(params)
  const encode = (value: string) => encodeURIComponent(value.replace(/[\\'"]/g, ''))
  const join = (key: string, value: string) => `${encode(key)}=${encode(value)}&`
  const url = baseUrl.endsWith('?') ? baseUrl : `${baseUrl}?`

  return entries.reduce((accumulator: string, [key, value]) => {
    return accumulator + join(key, value)
  }, url)
}

export function getAddrs(params: IGetParams) {
  return request.post<any>(
    '/abc', params,
    {
      requestOptions: {
        globalErrorMessage: true,
      },
    },
  )
}

export function getTestData() {
  return request.get<ResDataLists<Article>>(
    '/article/lists?per_page=20&page=1',
    {
      requestOptions: {
        globalErrorMessage: true,
      },
    },
  )
}
