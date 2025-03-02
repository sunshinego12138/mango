export const loadEnv = () => {
  return {
    /** 判断是否是本地环境 */
    isLocal: () => {
      return process.env.NODE_ENV === 'local'
    },

    /** 判断是否是测试环境 */
    isBeta: () => {
      return process.env.NODE_ENV === 'beta'
    },

    /** 判断是否是生产环境 */
    isProduction: () => {
      return process.env.NODE_ENV === 'production'
    },

    /** 获取当前环境 */
    getEnv: () => {
      return process.env.NODE_ENV ?? 'local'
    },
  }
}

export default loadEnv
