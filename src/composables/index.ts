/* eslint-disable no-console */
import { Random, sleep as Sleep } from '@lincy/utils'
import type { TopicList, UseTabList, UseTabListsInit, UserListConfig, UserListsInit } from '@/types'

export function useGlobal() {
  const ins = getCurrentInstance()!

  const ctx = ins.appContext.config.globalProperties
  const options = ins.type
  const router = useRouter()

  return {
    ctx,
    options,
    router,
  }
}

/**
 * 单列表封装
 * @param init { api: 接口封装 }
 * @returns
 */
export function useLists<T>(init: UserListsInit) {
  const body = $ref<HTMLElement>()!
  const res: UserListConfig<T> = reactive({
    ...init,
    timer: null,
    isLoaded: false,
    // 列表数据 ==>
    page: 1,
    dataList: [],
    // <==列表数据
    config: {
      // 下拉刷新 ==>
      isLoading: false,
      isRefresh: false,
      // <==下拉刷新
      // 滚动加载 ==>
      loadStatus: 'loadmore',
      isLock: false,
      loading: false,
      error: false,
      finished: false,
      // <==滚动加载
    },
  })

  /**
     * 请求列表接口
     */
  const getList = async () => {
    if (res.config.isLock)
      return
    res.config.isLock = true
    // 异步更新数据
    res.timer = setTimeout(() => {
      console.log('加载中...')
    }, 500)
    // 第一页时不显示loading
    if (res.page > 1)
      res.config.loading = true
    await Sleep(Random(300, 600))
    const { data, code } = await $api[init.api.method]<ResDataLists<T>>(init.api.url, { ...init.api.config, page: res.page })
    // 500毫秒内已经加载完成数据, 则清除定时器, 不再显示路由loading
    if (res.timer)
      clearTimeout(res.timer)

    console.log('加载完成')
    res.isLoaded = true

    if (code === 200) {
      // 如果是下拉刷新, 则只保留当前数据
      if (res.config.isRefresh) {
        res.dataList = [...data.data]
        res.config.isRefresh = false
      }
      else {
        res.dataList = res.dataList.concat(data.data)
      }
      await nextTick()
      // 加载状态结束
      res.config.loading = false
      // 数据全部加载完成
      if (data.last_page <= data.current_page) {
        res.config.finished = true
        res.config.loadStatus = 'nomore'
      }
      else {
        res.config.loadStatus = 'loadmore'
        res.page += 1
      }
      res.config.isLock = false
    }
    else {
      res.config.error = true
    }
  }

  /**
     * 刷新接口
     */
  const onRefresh = async () => {
    res.config.isRefresh = true
    res.page = 1
    await getList()
    res.config.isLoading = false
  }

  /**
     * 触底回调
     */
  const reachBottom = () => {
    if (res.config.loadStatus === 'nomore' || res.config.loadStatus === 'loading')
      return
    res.config.loadStatus = 'loading'
    getList()
  }
  const lazyLoading = () => {
    // 滚动到底部，再加载的处理事件
    const scrollTop = body.scrollTop
    const clientHeight = body.clientHeight
    const scrollHeight = body.scrollHeight
    if (scrollTop + clientHeight >= scrollHeight - 300)
      reachBottom()
  }

  return {
    body,
    ...toRefs(res),
    getList,
    onRefresh,
    reachBottom,
    lazyLoading,
  }
}

/**
 * Tab接口列表
 * @param init { api: 接口封装 }
 * @returns
 */
export function useTabLists<T>(init: UseTabListsInit) {
  const { options, globalStore } = useGlobal()

  const body = $ref<HTMLElement>()!
  const res: UseTabList<T> = reactive({
    ...init,
    timer: null,
    // 列表数据 ==>
    list: Array.from({ length: 5 }).fill('').map(() => ({
      page: 1,
      items: [],
      refreshing: false,
      loading: false,
      error: false,
      finished: false,
    })),
    // <==列表数据
  })

  const activeIndex = ref(0)

  const getList = async (index: number) => {
    const list: TopicList<T> = JSON.parse(JSON.stringify(res.list[index]))
    if (list.page === 1) {
      const body = document.querySelector(`.${options.name}`)
      body && body.scrollTo(0, 0)
    }
    // 500毫秒显示路由loading
    res.timer = setTimeout(() => {
      globalStore.$patch({ routerLoading: true })
    }, 500)
    // 第一页直接用路由loading
    if (list.page === 1)
      list.loading = false

    // 异步更新数据
    const { method, url, config } = res.api[index]
    await Sleep(Random(300, 600))
    const { code, data } = await $api[method as Methods]<ResDataLists<T>>(url, { ...config, page: list.page })
    // 500毫秒内已经加载完成数据, 则清除定时器, 不再显示路由loading
    if (res.timer)
      clearTimeout(res.timer)
    globalStore.$patch({ routerLoading: false })
    if (code === 200) {
      // 如果是下拉刷新, 则只保留当前数据
      if (list.refreshing) {
        list.items = [...data.data]
        list.refreshing = false
      }
      else {
        list.items = list.items.concat(data.data)
      }
      await nextTick()
      // 加载状态结束
      list.loading = false
      // 数据全部加载完成
      if (data.last_page <= data.current_page)
        list.finished = true
      else
        list.page += 1
    }
    else {
      list.error = true
    }
    res.list.splice(index, 1, list)
  }

  const onRefresh = async (index: number) => {
    res.list[index].refreshing = true
    res.list[index].page = 1
    await getList(index)
    res.list[index].refreshing = false
    showMsg('刷新成功')
  }

  return {
    body,
    res,
    getList,
    onRefresh,
    activeIndex,
  }
}
