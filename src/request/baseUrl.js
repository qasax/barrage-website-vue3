export const baseURL = "http://localhost:9960"
export const getAvatarByUserId = baseURL + '/user/getAvatarByUserId?userId='
export const getVideoByUrl = baseURL + '/video/getVideo?videoUrl='
export const getVideoPicByUrl = baseURL + '/video/getVideoPic?coverImageUrl='
export const getSubtitleByUrl = baseURL + '/video/getSubtitle?subtitleUrl='
export const uploadVideo = baseURL + '/video/upload/video'
export const uploadAvatar = baseURL + '/user/upload/avatar'
export const uploadCarousel = baseURL + '/website/uploadCarousel'
export const getCarouselImg = baseURL + '/website/getCarouselImg?carouseFileName='