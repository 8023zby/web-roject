const arr = []
export class RouteOjb {
  constructor(id, parentId, path, name, icon, children, remark) {
    this.id = id
    this.parentId = parentId
    this.path = path
    this.name = name
    this.icon = icon
    this.children = children
    this.remark = remark
  }
}
export function switchData(list) {
  for (const i of list) {
    switchData(i.childList)
    arr.push(new RouteOjb(i.authorityId, i.parentId, i.authorityCode, i.name, i.icon, [], i.remark))
  }
  return Routes(arr)
}
export function Routes(list) {
  const tempObj = {}
  for (const i in list) {
    tempObj[list[i].id] = new RouteOjb(
      list[i].authorityId,
      list[i].parentId,
      list[i].authorityCode,
      list[i].name, list[i].icon, [], i.remark)
  }
  return list.filter(item => {
    const childArr = list.filter(i => item.id === i.parentId)
    childArr.length > 0 ? item.children = childArr : ''
    return item.parentId === null || !tempObj[item.parentId]
  })
}

export function authorizeRoute(dicts, menus) {
  for (const dict of dicts) {
    const curMenu = menus.filter(x => x.remark == dict.path)

  }
}

export function switchList(list) {
  for (const i of list) {
    switchList(i.childList)
    arr.push(new RouteOjb(i.authorityId, i.parentId, i.authorityCode, i.name, i.icon, [], i.remark))
  }
}
