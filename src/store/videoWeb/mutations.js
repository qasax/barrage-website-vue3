export default {
  ADD_ACOUNTVUEX (state, countVuex) {
    state.countVuex = countVuex
  },
  toggleLoginDialog (state) {
    state.loginDialogVisible = !state.loginDialogVisible
  },
  toggleInfoEditDialog (state) {
    state.infoEditDialogVisible = !state.infoEditDialogVisible
  },
  toggleIsLogining (state) {
    state.isLogining = !state.isLogining
  },
  toggleAvatarSrc (state, avatarSrc) {
    state.avatarSrc = avatarSrc
  },
  toggleRole (state, role) {
    state.role = role
  }
}