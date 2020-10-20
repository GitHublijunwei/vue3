import http from './axios'
export function getList (obj) {
  return http.get('/android-shop/androidShop/findGoodsDetail',obj)
}
export function getList1 (obj) {
  return http.post('gateway/customer/mall/getMallSkuGoodsInfo',obj,1)
}

export function getList2 (obj) {
  return http.post('gateway/system/controller/selectCustomerPage',obj)
}
