export default [
  {
    name: 'callHistorysList',
    path: '/callHistorysList',
    component: resolve => require(['../../views/ecms/call/CallHistorysList.vue'], resolve),
    meta: { title: '呼叫记录' }
  },
  {
    name: 'MVPCallHistorysList',
    path: '/MVPCallHistorysList',
    component: resolve => require(['../../views/ecms/call/MVPCallHistorysList.vue'], resolve),
    meta: { title: '呼叫记录' }
  }
];
