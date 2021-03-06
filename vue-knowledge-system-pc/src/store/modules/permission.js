import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export function getNestName(routes = [], parentName = null) {
  let ret = [];
  routes.forEach(route => {
    const tmp = { ...route }
    if (parentName === 'AppNest') {
      ret.push(tmp.name);
    }
    if (tmp.children) {
      ret = [
        ...ret,
        ...getNestName(tmp.children, tmp.component.name)
      ];
    }
  })
  return ret;
}

const state = {
  routes: [],
  addRoutes: [],
  nestNames: [],
  isFirstInit: true
}

const getters = {
  permission_routes: state => state.routes,
  isFirstInit: state => state.isFirstInit
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    // in order to solve the nest route cache problem
    state.nestNames = getNestName(state.routes)
  },
  SET_INIT_STATE: (state, flag) => {
    state.isFirstInit = flag;
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  setInitState({ commit }, flag) {
    commit('SET_INIT_STATE', flag)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
