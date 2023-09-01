import type {
  IPermissionList,
  IRoleList,
  IUserDetail,
  IUserList,
} from './types/mock'

import request from '~/request/index'

export function getUserList() {
  return request.get<IUserList>(
    '/mock/getUserList',
    {
      requestOptions: {
        globalErrorMessage: true,
      },
    },
  )
}
export function getRoleList() {
  return request.get<IRoleList[]>(
    '/mock/getRoleList',
    {
      requestOptions: {
        globalErrorMessage: true,
      },
    },
  )
}
export function getPermissionList() {
  return request.get<IPermissionList[]>(
    '/mock/getPermissionList',
    {
      requestOptions: {
        globalErrorMessage: true,
      },
    },
  )
}
export function getUserDetail(data: { id: any }) {
  return request.get<IUserDetail[]>(
    `/mock/getUserDetail?id${data.id}`,
    {
      requestOptions: {
        globalErrorMessage: true,
      },
    },
  )
}
