import { _delete, _get, _post, _put, _put_qs } from './http'
import urls from './config'

export const ApiNurseDuty = {
  select: (params = null) => {
    return _get({
      url: urls['shiftLibrary'],
      data: params
    })
  },
  save: (params = {}) => {
    return params['repoShiftId']
      ? ApiNurseDuty.update(params)
      : ApiNurseDuty.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['shiftLibrary'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['shiftLibrary'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['shiftLibrary'],
      data: params
    })
  },
  status: (params = null) => {
    return _put_qs({
      url: urls['shiftLibraryStatus'],
      data: params
    })
  }
}

export const ApiNurseShift = {
  types: (params = null) => {
    return _get({
      url: urls['shiftType'],
      data: params
    })
  },
  select: (params = null) => {
    return _get({
      url: urls['shift'],
      data: params
    })
  },
  save: (params = {}) => {
    return params['shiftId']
      ? ApiNurseShift.update(params)
      : ApiNurseShift.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['shift'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['shift'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['shift'],
      data: params
    })
  },
  status: (params = null) => {
    return _put_qs({
      url: urls['shiftStatus'],
      data: params
    })
  },
  model: (params = null) => {
    return _get({
      url: urls['shiftModel'],
      data: params
    })
  },
  saveModel: (params = {}) => {
    return params['deptId']
      ? ApiNurseShift.updateModel(params)
      : ApiNurseShift.insertModel(params)
  },
  insertModel: (params = null) => {
    return _post({
      url: urls['shiftModel'],
      data: params
    })
  },
  updateModel: (params = null) => {
    return _put({
      url: urls['shiftModel'],
      data: params
    })
  },
  importShift: (params = null) => {
    return _post({
      url: urls['shiftImport'],
      data: params
    })
  }
}

export const ApiComposedShit = {
  select: (params = null) => {
    return _get({
      url: urls['composedShit'],
      data: params
    })
  },
  save: (params = {}) => {
    return params['composeId']
      ? ApiComposedShit.update(params)
      : ApiComposedShit.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['composedShit'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['composedShit'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['composedShit'],
      data: params
    })
  }
}
